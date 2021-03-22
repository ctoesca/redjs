
import {Timer} from './utils/Timer';
import {Database} from './Data/Database';
import {RedjsServer} from './RedjsServer';
import * as utils from './utils';
import {Parser} from './utils/Parser'
import {Commander} from './Commander'
import Promise = require('bluebird')
import EventEmitter = require('events')
import net = require('net')
import uuid = require('uuid/v4')
import {RedisError} from './Errors/RedisError'

import * as Logger from 'bunyan'

export class Connection extends EventEmitter {

	public id: string = null
	public lastError: any = null
	public database: Database = null



	protected sock: net.Socket = null
	protected commander: Commander = null
	protected server: RedjsServer = null
	protected logger: Logger = null
	protected mainTimer: Timer = null
	protected parser: Parser = null
	protected closing = false
	protected processingData = false

	// internal used by server:
	protected onCommand: Function = null

	// transations
	protected inTransaction = false
	protected transactionCommands: any[] = []
	protected transactionErrors: any = []


	constructor(server: RedjsServer, sock: net.Socket, commander: Commander) {
		super();

		this.id = uuid()
		this.sock = sock
		this.server = server
		this.commander = commander

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		/* this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		this.mainTimer.start() */

		this.lastError = null

		this.sock.on('close', () => {
			this.onSockClose()
		})

		this.sock.on('data', (data) => {
			this.onSockData(data)
		})

		this.sock.on('error', (err: any) => {
			if (err.code !== 'ECONNRESET') {
				this.logger.error('ERROR: ' + this.getRemoteAddressPort(), err);
			}
		})

		this.logger.debug('CONNECTED: ' + this.getRemoteAddressPort() )

		this.parser = new Parser()

		this.setDatabase(0);
	}

	public beginTransaction() {

		if (this.inTransaction) {
			throw new RedisError( 'ERR MULTI calls can not be nested' )
		}
		this.inTransaction = true
		this.transactionCommands = []
	}

	public commitTransaction() {

		if (!this.inTransaction) {
			throw new RedisError( 'ERR EXEC without MULTI' )
		}
		if (this.transactionErrors.length > 0) {
			this.cancelTransaction(true)
			throw new RedisError( 'EXECABORT Transaction discarded because of previous errors.' )
		}

		// EXECABORT Transaction discarded because of previous errors.

		let responses = []

		for (let command of this.transactionCommands) {
			try {
				let responseData = this.execCommand(command.name, command.args, true)
				responses.push(  responseData )
			} catch (err) {
				console.log('exec command error ' + err.toString())
				responses.push( err );
			}

		}

		this.inTransaction = false
		this.transactionCommands = []
		this.transactionErrors = []
		return responses

	}

	public cancelTransaction(force = false) {

		if (!force && !this.inTransaction) {
			throw new RedisError( 'ERR DISCARD without MULTI' )
		}
		this.inTransaction = false
		this.transactionCommands = []
		this.transactionErrors = []
	}

	public addTransactionCommand(name: string, args: any) {

		try {
			this.commander.execCommand(this, true, name, ...args)
		} catch (err: any) {
			this.logger.error('addTransactionCommand', err)
			this.transactionErrors.push(err)
			throw err
		} finally {
			this.transactionCommands.push({
				name: name,
				args: args
			})
		}
	}

	public setDatabase( index: number ) {
		this.database = this.server.datastore.getDb(index)
		return this.database
	}

	public setCommandListener( v: Function = null ) {
		this.onCommand = v
	}

	public removeCommandListener() {
		this.onCommand = null
	}
	public getCommandListener() {
		return this.onCommand
	}

	public getRemoteAddressPort() {
		return this.sock.remoteAddress + ':' + this.sock.remotePort
	}

	public writeMonitorData( data: any ) {
		this.sock.write(this.parser.toRESP( data, 'simpleString' ) )
	}

	public writeChannelMessage( channel: string, payload: any) {
		let data = ['message', channel, payload]
		this.sock.write(this.parser.toRESP(data))
	}

	public destroy() {
		// this.mainTimer.destroy()
		this.closing = false;
		this.processingData = false;
		this.removeCommandListener()
		this.removeAllListeners()
		this.sock.removeAllListeners()
		this.sock.destroy();
		this.sock = null
		this.commander = null
	}

	public quit() {
		if (this.processingData) {
			this.closing = true;
		} else {
			this.sock.end()
		}
	}

	public pause() {
		this.sock.pause()
	}

	public resume() {
		this.sock.resume()
	}

	protected execCommand(cmd: string, args: any[], force = false): any {

		if (this.onCommand) {
			this.onCommand(this, cmd, ...args)
		}
		let resp
		if (!force && this.inTransaction && (cmd !== 'exec') && (cmd !== 'multi') && (cmd !== 'discard')) {
			this.addTransactionCommand(cmd, args)
			resp = 'QUEUED'

		} else {
			let responseData = this.commander.execCommand(this, false, cmd, ...args)
			resp = responseData
		}
		return resp
	}

	protected processPipelineRequest( requestData: any[] ) {
		/*
		pipeline
		*/

		let responses = []
		for (let data of requestData) {

			let resp
			let cmd = data[0].toLowerCase()
			data.shift()

			try {
				resp = this.execCommand(cmd, data)
			} catch (err) {
				resp = err
			}

			responses.push(resp)
			resp = this.parser.toRESP(resp)
			this.sock.write(resp)
		}

	}

	protected processSingleRequest( requestData: any[], sendResponse = true ) {

		let cmd = requestData[0].toLowerCase()
		requestData.shift()

		let resp = this.parser.toRESP( this.execCommand(cmd, requestData) )
		this.sock.write( resp )

	}

	protected onSockData(data: any) {

		// this.logger.debug('onSockData', data)
		let requestData
		try {
			this.processingData = true;

			requestData = this.parser.fromRESP(data)

			if (typeof requestData[0] === 'object') {
				this.processPipelineRequest(requestData);
			} else {
				this.processSingleRequest(requestData)
			}

		} catch (err) {
			this.lastError = err

			this.logger.error('REQUEST: ', requestData)
			this.logger.error('RESPONSE: ', err.toString() )

			let resp = this.parser.toRESP( err )
			this.sock.write( resp );

		} finally {
			this.processingData = false;
		}

		if (this.closing) {
			this.sock.end();
		}

	}

	protected onSockClose() {
		this.logger.debug('CLOSED: ' + this.getRemoteAddressPort())
		this.emit('close')
		this.destroy()
	}

	/* protected onTimer() {

	} */

}

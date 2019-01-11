
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


export class Connection extends EventEmitter {

	public id: string = null
	public lastError: any = null
	public database: Database = null



	protected sock: net.Socket = null
	protected commander: Commander = null
	protected server: RedjsServer = null
	protected logger: any = null
	protected mainTimer: Timer = null
	protected parser: Parser = null
	protected closing = false
	protected processingData = false
	// internal used by server:
	protected onCommand: Function = null

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

	protected processPipelineRequest( requestData: any ) {
		/*
		pipeline
		*/
		let responses = []
		for (let data of requestData) {
			let cmd = data[0].toLowerCase()
			data.shift()

			if (this.onCommand) {
				this.onCommand(this, cmd, ...data)
			}
			let responseData = this.commander.execCommand(cmd, this, ...data)
			responses.push( responseData )
		}

		for (let i = 0; i < responses.length; i++) {
			this.sock.write( this.parser.toRESP( responses[i] ) )
		}
	}

	protected processSingleRequest( requestData: any ) {
		let cmd = requestData[0].toLowerCase()
		requestData.shift()
		if (this.onCommand) {
			this.onCommand(this, cmd, ...requestData)
		}
		let responseData = this.commander.execCommand(cmd, this, ...requestData)
		let resp = this.parser.toRESP( responseData )
		this.sock.write( resp )
	}

	protected onSockData(data: any) {

		// this.logger.debug('onSockData', data)

		try {
			this.processingData = true;

			let requestData = this.parser.fromRESP(data)

			if (typeof requestData[0] === 'object') {
				this.processPipelineRequest(requestData);
			} else {
				this.processSingleRequest(requestData)
			}

			this.processingData = false;

		} catch (err) {
			if (this.lastError !== err.toString()) {
				this.lastError = err.toString()
				this.logger.error('REQUEST: ' + data.toString().replace(/\r\n/g, '\\r\\n') + ', ERROR: ' , err)
			}
			this.sock.write( this.parser.toRESP( this.lastError, 'error' ) );
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

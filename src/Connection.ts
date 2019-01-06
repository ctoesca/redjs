
import {Timer} from './utils/Timer';
import {Database} from './Data/Database';
import {RedjsServer} from './RedjsServer';
import * as utils from './utils';
import {Parser} from './utils/Parser'
import {Commander} from './Commander'
import Promise = require('bluebird')
import EventEmitter = require('events')
import _ = require('lodash')
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

	constructor(server: RedjsServer, sock: net.Socket, commander: Commander) {
		super();

		this.id = uuid()
		this.sock = sock
		this.server = server
		this.commander = commander

		this.database = this.server.datastore.getDb(0)

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		this.mainTimer.start()

		this.lastError = null

		this.sock.on('close', () => {
			this.onSockClose()
		})
		this.sock.on('data', (data) => {
			this.onSockData(data)
		})
		this.sock.on('error', (err: Error) => {
			this.onSockError(err)
		})

		this.logger.debug('CONNECTED: ' + this.sock.remoteAddress + ':' + this.sock.remotePort)

		this.parser = new Parser()
	}

	public getRemoteAddress() {
		return this.sock.remoteAddress
	}
	public getRemotePort() {
		return this.sock.remotePort
	}

	public writeMonitorData( data: any ) {
		this.sock.write(this.parser.toRESP( data, 'simpleString' ) )
	}

	public writeChannelMessage( channel: string, payload: any) {
		let data = ['message', channel, payload]
		this.sock.write(this.parser.toRESP(data))
	}

	public destroy() {
		this.mainTimer.destroy()
		this.removeAllListeners()
		this.sock.removeAllListeners()
		this.sock = null
		this.commander = null
	}

	public pause() {
		this.sock.pause()
	}
	public resume() {
		this.sock.resume()
	}
	protected onSockData(data: any) {

		this.logger.debug('onSockData ' +  this.sock.remoteAddress + ': ' + data)

		try {

			// console.log('request: '+data.toString().replace(/\r\n/g, '\\r\\n').replace(/\n/g, '\\n'))
			/* pipeline:
			*3\r\n
				$3\r\nset\r\n
				$3\r\nfoo\r\n
				$3\r\nbar\r\n
			*2\r\n
				$3\r\ndel\r\n
				$2\r\ncc\r\n
				*/

				let requestData = this.parser.fromRESP(data)
				// console.log('requestData=', requestData)

			/* !!
			[2019-01-05T16:36:28.421Z] ERROR: Connection/21572 on PC:
				REQUEST:
				*3\r\n
					$5\r\nlpush\r\n
					$6\r\nmylist\r\n
					$4\r\ntoto\r\n
				*3\r\n
					$5\r\nlpush\r\n
					$6\r\nmylist\r\n
					$4\r\ntoto\r\n

				ERROR:  TypeError: requestData[0].toLowerCase is not a function
				at Connection.onSockData (G:\dev\nexilearn\redjs\dist\Connection.js:69:38)
				at Socket.Connection.sock.on (G:\dev\nexilearn\redjs\dist\Connection.js:36:18)
				at emitOne (events.js:116:13)
				at Socket.emit (events.js:211:7)
				at addChunk (_stream_readable.js:263:12)
				at readableAddChunk (_stream_readable.js:250:11)
				at Socket.Readable.push (_stream_readable.js:208:10)
				at TCP.onread (net.js:597:20)
				*/

				let commands = []

				if (typeof requestData[0] === 'object') {
				/*
				pipeline
				*/
				let responses = []
				for (let i = 0; i < requestData.length ; i++) {
					let cmd = requestData[i][0].toLowerCase()
					requestData[i].shift()

					if (this.listenerCount('command') > 0) {
						this.emit('command', this, cmd, ...requestData[i])
					}
					let responseData = this.commander.execCommand(cmd, this, ...requestData[i])
					responses.push( responseData )
				}

				for (let i = 0; i < responses.length; i++) {
					this.sock.write( this.parser.toRESP( responses[i] ) )
				}

			} else {
				let cmd = requestData[0].toLowerCase()
				requestData.shift()
				if (this.listenerCount('command') > 0) {
					this.emit('command', this, cmd, ...requestData)
				}
				let responseData = this.commander.execCommand(cmd, this, ...requestData)
				let resp = this.parser.toRESP( responseData )
				this.sock.write( resp )
			}



		} catch (err) {
			if (this.lastError !== err.toString()) {
				this.lastError = err.toString()
				this.logger.error('REQUEST: ' + data.toString().replace(/\r\n/g, '\\r\\n') + ', ERROR: ' , err)
			}
			let resp = this.parser.toRESP( err.toString(), 'error' )
			this.sock.write( resp );
		}
	}


	protected onSockError(err: any) {
		if (err.code !== 'ECONNRESET') {
			this.logger.error('ERROR: ' + this.sock.remoteAddress + ' ' + this.sock.remotePort, err);
		}
	}

	protected onSockClose() {
		this.logger.debug('CLOSED: ' + this.sock.remoteAddress + ' ' + this.sock.remotePort)
		this.emit('close')
	}

	protected onTimer() {

	}

}

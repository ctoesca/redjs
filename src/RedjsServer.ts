
import {Timer} from './utils/Timer';
import {Datastore} from './Data/Datastore';
import {Commander} from './Commander';
import {Connection} from './Connection';
import * as utils from './utils';
import bunyan = require('bunyan')
import Promise = require('bluebird');
import EventEmitter = require('events');
import _ = require('lodash');
import net = require('net');

export class RedjsServer extends EventEmitter {

	public server: net.Server = null
	public started: Boolean = false
	public lastError: any = null
	public connections: Map<string, Connection> = new Map<string, Connection>()
	public datastore: Datastore = null

	protected logger: any = null
	protected _workers: any = {}
	protected monitoredConnections: Map<string, Connection> = new Map<string, Connection>()
	protected mainTimer: Timer = null
	protected commander: Commander = null
	protected options: any = null

	constructor( ...opt: any[] ) {

		super();

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')


		this.parseOptions(...opt)

		/* this.mainTimer = new Timer({delay: 10000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this));
		this.mainTimer.start() */

		this.datastore = new Datastore({server: this})
		this.commander = new Commander({server: this, datastore: this.datastore})
	}

	public static createLogger( opt: any ) {
		return bunyan.createLogger({ name: opt.name })
	}

	public static getDefaultOptions() {
		return {
			// Connection
			port: 6969,
			host: 'localhost'
		}
	}

	public broadcast(channel: string, msg: any, connections: Map<string, Connection> = null) {
		let r = 0;

		if (!connections) {
			connections =  this.connections
		}

		connections.forEach( ( connection: Connection, connId: string ) => {
			connection.writeChannelMessage( channel, msg );
			r ++
		})

		return r
	}

	public getConnectionsCount() {
		return this.connections.size
	}

	public getMonitoredConnectionsCount() {
		return this.monitoredConnections.size
	}

	public start() {
		if (this.started) {
			return
		}

		this.createServer()
		this.started = true;
	}


	protected parseOptions(...args: any[]) {

		this.options = {};
		for (let i = 0; i < args.length; ++i) {
			let arg = args[i];
			if (arg === null || typeof arg === 'undefined') {
				continue;
			}
			if (typeof arg === 'object') {
				_.defaults(this.options, arg);
			} else if (typeof arg === 'string') {
				_.defaults(this.options, utils.parseURL(arg));
			} else if (typeof arg === 'number') {
				this.options.port = arg;
			} else {
				throw new Error('Invalid argument ' + arg);
			}
		}

		_.defaults(this.options, RedjsServer.getDefaultOptions());

		if (typeof this.options.port === 'string') {
			this.options.port = parseInt(this.options.port, 10);
		}
		if (typeof this.options.db === 'string') {
			this.options.db = parseInt(this.options.db, 10);
		}
	};

	/* protected onTimer() {

	} */

	protected logConnectionsCount() {
		this.logger.debug('Connections count: ' + this.getConnectionsCount())
	}

	protected onConnectionClosed(conn: Connection) {

		this.emit('connection-close', conn)

		if (this.connections.has(conn.id)) {
			this.connections.delete(conn.id)
		}

		this.monitoredConnections.delete(conn.id)

		this.logConnectionsCount()

		if (this.getMonitoredConnectionsCount() === 0) {
			this.connections.forEach( ( connection: Connection, connId: string ) => {
				connection.removeAllListeners('command')
			})
		}
	}

	protected onMonitoredConnection(conn: Connection) {
		this.monitoredConnections.set(conn.id, conn)

		this.connections.forEach( ( connection: Connection, connId: string ) => {
			connection.on('command', (sentBy: Connection, cmd: string, ...args) => {
				this.onCommand(sentBy, cmd, ...args)
			})
		})
	}

	protected onCommand(conn: Connection, cmd: string, ...args: any[]) {
		let timestamp: number = new Date().getTime() / 1000
		let data: string = timestamp + ' [0 ' + conn.getRemoteAddressPort() + '] \'' + cmd + '\''
		for (let arg of args) {
			data += ' "' + arg + '"'
		}

		this.monitoredConnections.forEach( ( connection: Connection, connId: string ) => {
			connection.writeMonitorData(data)
		})
	}

	protected createServer() {

		return new Promise( (resolve, reject) => {

			let HOST = this.options.host;
			let PORT = this.options.port;

			this.server = net.createServer((sock: net.Socket) => {
				let conn: Connection = new Connection(this, sock, this.commander)
				conn.on('close', () => {
					this.onConnectionClosed(conn)
				})
				conn.on('monitor', () => {
					this.onMonitoredConnection(conn)
				})

				this.connections.set(conn.id, conn)

				this.logConnectionsCount()

				if (this.getMonitoredConnectionsCount() > 0) {
					conn.on('command', (sentBy: Connection, cmd: string, ...args) => {
						this.onCommand(sentBy, cmd, ...args)
					})
				}
			})
			this.server.on('error', (e) => {
				this.logger.error(e.toString());
				reject(e)
				process.exit(1)
			})
			this.server.listen(PORT, HOST, () => {
				this.logger.info('Server listening on ' + HOST + ':' + PORT);
				resolve()
			});

		})
	}
}

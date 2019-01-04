"use strict";

const Timer = require('./utils/Timer');
const Promise = require('bluebird');
const EventEmitter = require('events');
const DataManager = require('./DataManager');
const cluster = require('cluster');
const bunyan = require('bunyan');
const _ = require('lodash');

const Connection = require('./Connection')
/*const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort
} = require('worker_threads');*/


module.exports = class RedjsServer extends EventEmitter {
	
	constructor( ...opt ){ 

		super();

		this.parseOptions(opt)

		this.logger = bunyan.createLogger({ name: this.constructor.name });			
		this.logger.info(this.constructor.name+" created");   

		this.server = null
		this._workers = {}
		this.started = false;
		this.lastError = null
		this.connections = {}
		this.monitoredConnections = {}
		
		this.mainTimer = new Timer({delay: 10000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		this.mainTimer.start()
		
		this.dataManager = new DataManager({server: this})
	}

	static getDefaultOptions(){
		return {
		  // Connection
		  port: 6969,
		  host: 'localhost'	
		}
	}

	parseOptions(args = {}) 
	{
		this.options = {};
		for (var i = 0; i < args.length; ++i) {
			var arg = args[i];
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

	onFork(worker){

		this._workers[worker.process.pid] = worker
		
		worker.on('message', (msg) => {
			this.onMessageFromWorker(msg, worker)
		});
	}

	onExit (worker, code, signal)
	{
		this.logger.warn(`worker ${worker.process.pid} died code=`+code);
		delete this._workers[worker.process.pid]
		//cluster.fork();
	}
	
	onTimer(){

	}

	broadcast(channel, msg, connectionsId = null){
		var r = 0;

		var connections = this.connections
		if (connectionsId)
			connections = connectionsId

		for (let connId in connections){
			if ( this.connections[connId] )
			{				
				let conn = this.connections[connId]
				conn.writeChannelMessage( channel, msg );
				r ++
			}
		}

		return r
	}

	getConnectionsCount(){
		return Object.keys(this.connections).length	
	}

	getMonitoredConnectionsCount(){
		return Object.keys(this.monitoredConnections).length	
	}

	onConnectionClosed(conn){
		if (this.connections[conn.id]){
			this.connections[conn.id].destroy()
			delete this.connections[conn.id]
		}
		delete this.monitoredConnections[conn.id]
		this.logger.info("Connections count: "+this.getConnectionsCount())

		if (this.getMonitoredConnectionsCount() == 0)
		{
			for (let connId in this.connections)
				this.connections[connId].removeAllListeners('command')
		}
	}

	onMonitoredConnection(conn)
	{
		this.monitoredConnections[conn.id] = conn
		for (let connId in this.connections)
		{
			this.connections[connId].on('command', (conn, cmd, ...args) => {
				this.onCommand(conn, cmd, ...args)
			})
		}
	}

	onCommand(conn, cmd, ...args)
	{	
		var timestamp = new Date().getTime() /1000
		var data = timestamp+' [0 '+conn.sock.remoteAddress +':'+  conn.sock.remotePort+'] "'+cmd+'"'
		for (let arg of args)
			data += ' "'+arg+'"'
		
		for (let connId in this.monitoredConnections)
			this.monitoredConnections[connId].writeMonitorData(data)			
	}

	createServer(){

		return new Promise( (resolve, reject) => {

			var net = require('net');
			var HOST = this.options.host;
			var PORT = this.options.port;

			this.server = net.createServer((sock) => {
				var conn = new Connection(sock, this.dataManager)
				conn.on('close', () => {
					this.onConnectionClosed(conn)
				})
				conn.on('monitor', () => {
					this.onMonitoredConnection(conn)
				})
				
				this.connections[conn.id] = conn
				
				this.logger.info("Connections count: "+this.getConnectionsCount())

				if (this.getMonitoredConnectionsCount()>0){
					conn.on('command', (conn, cmd, ...args) => {
						this.onCommand(conn, cmd, ...args)
					})
				}
			})
			this.server.on('error', (e) => {
				this.logger.error(e.toString());				
				reject(e)
				process.exit(1)
			})
			this.server.listen(PORT, HOST, () => {
				this.logger.info('Server listening on ' + HOST +':'+ PORT);
				resolve()
			});

		})	
	}

	start()
	{
		if (this.started)	
			return

		this.createServer()
		this.started = true;
	}	

}





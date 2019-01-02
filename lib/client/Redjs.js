"use strict";

const Timer = require('../utils/Timer');
const Promise = require('bluebird');
const uuid = require('uuid/v4');
const EventEmitter = require('events');
const bunyan = require('bunyan');
const _ = require('lodash');

const Keys = require('../server/DataManagers/Keys');
const Hashes = require('../server/DataManagers/Hashes');
const PubSub = require('../server/DataManagers/PubSub');
const Lists = require('../server/DataManagers/Lists');
const Sets = require('../server/DataManagers/Sets');
const SortedSets = require('../server/DataManagers/SortedSets');
const utils = require('../utils');


module.exports = class Redjs extends EventEmitter {
	   
	constructor( ...args ){ 
		//[port], [host], [opt]

		super();
		
		this.parseOptions(args)
	
		this.logger = bunyan.createLogger({ name: this.constructor.name });			
		this.logger.info(this.constructor.name+" created");
	
		this.server = null
		this.clientId = uuid()

		/*this.mainTimer = new Timer({delay: 5000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		this.mainTimer.start()*/

		this.runningCommands = {}
		
		this.createCommands(Hashes.getCommandsNames())
		this.createCommands(Keys.getCommandsNames())
		this.createCommands(PubSub.getCommandsNames())
		this.createCommands(Sets.getCommandsNames())
		this.createCommands(Lists.getCommandsNames())
		this.createCommands(SortedSets.getCommandsNames())

		this._onMessage = this.onMessageToWorker.bind(this)

		process.on('message', this._onMessage);

		if (!this.options.lazyConnect)
			this.connect()
	}
	
	getNewRequestId(){
		if (!Redjs.requestCount)
			Redjs.requestCount = 0

		Redjs.requestCount ++
		return this.clientId+'-'+Redjs.requestCount
	}
	
	static getDefaultOptions(){
		return {
		  // Connection
		  port: 6379,
		  host: 'localhost',
		  family: 4,
		  connectTimeout: 10000,
		  retryStrategy: function (times) {
		    return Math.min(times * 50, 2000);
		  },
		  keepAlive: 0,
		  noDelay: true,
		  connectionName: null,
		  // Sentinel
		  sentinels: null,
		  name: null,
		  role: 'master',
		  sentinelRetryStrategy: function (times) {
		    return Math.min(times * 10, 1000);
		  },
		  // Status
		  password: null,
		  db: 0,
		  // Others
		  dropBufferSupport: false,
		  enableOfflineQueue: true,
		  enableReadyCheck: true,
		  autoResubscribe: true,
		  autoResendUnfulfilledCommands: true,
		  lazyConnect: false,
		  keyPrefix: '',
		  reconnectOnError: null,
		  readOnly: false,
		  stringNumbers: false,
		  maxRetriesPerRequest: 20
		}
	} 

	parseOptions(args) 
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

		_.defaults(this.options, Redjs.getDefaultOptions());

		if (typeof this.options.port === 'string') {
			this.options.port = parseInt(this.options.port, 10);
		}
		if (typeof this.options.db === 'string') {
			this.options.db = parseInt(this.options.db, 10);
		}
		
	};

	duplicate(){
		return new Redjs(this.options)
	}

	/* Connection Events 
	Event	Description
		connect	emits when a connection is established to the Redis server.
		ready	If enableReadyCheck is true, client will emit ready when the server reports that it is ready to receive commands (e.g. finish loading data from disk).
		Otherwise, ready will be emitted immediately right after the connect event.
		error	emits when an error occurs while connecting.
		However, ioredis emits all error events silently (only emits when there's at least one listener) so that your application won't crash if you're not listening to the error event.
		close	emits when an established Redis server connection has closed.
		reconnecting	emits after close when a reconnection will be made. The argument of the event is the time (in ms) before reconnecting.
		end	emits after close when no more reconnections will be made, or the connection is failed to establish.
	*/
	connect(cb){

		return this.sendCommand("connect", this.options)
		.then( (r) => {
			this.connected = true;
			this.emit('connect', r)
			this.emit('ready')
			if (cb)
				cb(null, r)
		})
		.catch(err => {
			if (this.listenerCount >0 )
				this.emit('error', err)
			else
				this.logger.error("CONNECT ERROR: "+err.toString())
			if (cb)
				cb(err, null)
		})

	}

	disconnect(){
		process.off('message', this._onMessage);
		this.emit('close')
		this.connected = false
	}

	quit(){
		this.disconnect()
	}

	onTimer(){
	}

	onChannelMessage(channel, message){
		this.emit( 'message', channel, message )
	}


	/* ------------------------------------------------------ */

	transformArgs( args ){
		var _args = []
		var callback = null
		for (var i=0; i<args.length; i++){
			var arg = args[i]
			if ((typeof arg == "string")||(typeof arg == "number"))
			{
				_args.push(arg)
			}
			else if (typeof arg == "function"){
				callback = arg
				break;
			}
		}
		return {
			args: _args,
			callback: callback
		}
	}

	createCommands(commandsNames)
	{
		for (var i=0; i<commandsNames.length; i++)
			this.createCommand(commandsNames[i])
	}

	createCommand(cmd)
	{
		cmd = cmd.toLowerCase()

		this[cmd] = function(...args)
		{
			var _args = this.transformArgs(args)
			var callback = _args.callback

			return this.sendCommand(cmd, _args.args )
			.then( (result) => {
				if (callback)
					callback(null,result)
				return result
			})
			.catch( err => {		
				if (callback)
					callback(err)
				throw err
			})
		}.bind(this)

	
	}
	
	sendCommand(cmd, ...args)
	{
		if (!this.connected && (cmd != 'connect') )
		{
			return Promise.reject("Not connected")
		}else
		{
			var _args = []
			for (var i=0; i<args.length; i++)
			{
				if (( typeof args[i] == 'object') &&  ( typeof args[i].push == 'function'))
				{
					if ( typeof args[i].push == 'function'){
						for (var j=0; j<args[i].length; j++)
							_args.push( args[i][j])
					}
				}
				else{
					_args.push( args[i] );
				}
			}
			
			var cmdId = this.getNewRequestId()

			var command = {
				id: cmdId,
				clientId: this.clientId,
				workerPID: process.pid,
				cmd: cmd,
				args: _args
			}

			return new Promise( (resolve, reject) => {

				this.runningCommands[cmdId] = {
					command: command,
					onResponse: function(result){
						resolve(result)
					},
					onError: function(err){

						reject(err)
					}
				}
				//this.logger.debug("SEND_COMMAND "+cmd+" ID="+cmdId)
				process.send( JSON.stringify(command));
			})
		}
		
	}

	onMessageToWorker(msg) 
	{
		var msg = JSON.parse(msg)

		if (msg.type == 'broadcast')
		{
			this.onChannelMessage( msg.channel, msg.message )
		}
		else if ((msg.type == 'response')||(msg.type == 'error')) 
		{

			if (msg.clientId != this.clientId)
				return;
			
			if (typeof this.runningCommands[msg.id] != "undefined")
			{
				if (msg.type == 'response'){
					this.runningCommands[msg.id].onResponse( msg.result )
				}
				else if (msg.type == 'error'){
					this.runningCommands[msg.id].onError( msg.cmd+": "+msg.result )
				}
				delete this.runningCommands[msg.id]
			}else{
				this.logger.error("onMessageToWorker: running command does not exist")
			}
		}else{
			this.logger.error("WORKER.onMessageToWorker: unknown type: '"+msg.type+"'")
		}

	};



}






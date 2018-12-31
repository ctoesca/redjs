"use strict";

const Timer = require('./Timer');
const Promise = require('bluebird');
const uuid = require('uuid/v4');
const EventEmitter = require('events');

module.exports = class Redjs extends EventEmitter {
	   
	constructor(opt){ 

		super();

		if (opt)
			this.config = opt
		
		this.logger = global.getLogger("Redjs");			
		this.logger.info("Redjs created");    
		this.server = null

		/*this.mainTimer = new Timer({delay: 5000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		this.mainTimer.start()*/

		this.started = false;
		
		this.runningCommands = {}

		this.commandsNames = ["subscribe", "publish", "get", "set", "hget", "hset", "incr", "sadd", "smembers", "srem"]
		
		for (let i=0; i<this.commandsNames.length; i++)
			this.createCommand(this.commandsNames[i])

		process.on('message', (msg) => {
			this.onMessageToWorker(msg)
		});

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
			if (typeof arg == "string"){
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

	createCommand(cmd){
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
		var _args = []
		for (var i=0; i<args.length; i++)
		{
			if ( typeof args[i] == 'object') 
			{
				for (var j=0; j<args[i].length; j++)
				{
					_args.push( args[i][j])
				}
			}else{
				_args.push( args[i] );
			}
		}
		
		var cmdId = uuid()

		var command = {
			id: cmdId,
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

	onMessageToWorker(msg) 
	{
		var msg = JSON.parse(msg)

		//logger.error(msg)

		if (this.runningCommands[msg.id] != "undefined")
		{
			if (msg.type == 'response'){
				this.runningCommands[msg.id].onResponse( msg.result )
			}
			else if (msg.type == 'broadcast'){
				this.onChannelMessage( msg.channel, msg.message )
			}
			else if (msg.type == 'error'){
				this.runningCommands[msg.id].onError( msg.cmd+": "+msg.result )
			}
			else{
				this.logger.error("WORKER.onMessageToWorker: unknown type: '"+msg.type+"'")
			}

			delete this.runningCommands[msg.id]
		}
	};



}





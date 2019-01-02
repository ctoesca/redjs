"use strict";

const Timer = require('../utils/Timer');
const Promise = require('bluebird');
const EventEmitter = require('events');
const DataManager = require('./DataManager');
const cluster = require('cluster');
const bunyan = require('bunyan');

module.exports = class RedjsServer extends EventEmitter {
	   
	constructor(opt){ 

		super();

		if (opt)
			this.config = opt

		this.logger = bunyan.createLogger({ name: this.constructor.name });			
		this.logger.info(this.constructor.name+" created");      
		this.server = null


		this._workers = {}
		
		this.mainTimer = new Timer({delay: 10000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		this.mainTimer.start()
		
		this.started = false;

		this.connections = {}
		
		this.dataManager = new DataManager({master: this})
	}

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

	broadcast(channel, msg, workersByPid = null){
		var r = 0;

		Object.keys(cluster.workers).forEach((id) => 
		{
			var data = {
				type: "broadcast",				
				message: msg,
				channel: channel
			}

			var canSend = true;
			if (workersByPid)
			{			
				if (!workersByPid[cluster.workers[id].process.pid])	
					canSend = false;			
			}

			if (canSend)
			{
				this.logger.debug("broadcast to worker "+cluster.workers[id].process.pid)
				cluster.workers[id].send( JSON.stringify(data) );
				r ++
			}
		})
		return r
	}

	onMessageFromWorker(msg, worker) 
	{
	
		try{
			var msg = JSON.parse( msg )
	
			//console.log("MASTER.onMessageFromWorker PID="+ worker.process.pid, msg)

			var data = {
				worker: worker,
				clientId: msg.clientId				
			}
			var result = this.dataManager.execCommand(msg.cmd, data, ...msg.args)
			var response = {
				id: msg.id,
				type: 'response',
				clientId: msg.clientId,
				cmd: msg.cmd,
				workerPID: worker.process.pid,
				result: result
			}
		}catch(err)
		{
			console.error("MASTER."+msg.cmd+", args=", msg.args, err)
			var response = {
				id: msg.id,
				type: 'error',
				cmd: msg.cmd,
				clientId: msg.clientId,
				workerPID: worker.process.pid,
				result: err.toString()
			}
		}
		
		this._workers[msg.workerPID].send( JSON.stringify(response) );

	}

	start(){
		if (this.started)	
			return

		//cluster.schedulingPolicy = cluster.SCHED_RR
		cluster.on('fork', (worker) => {
			this.onFork(worker)
		})
		cluster.on('exit', (worker, code, signal) => {
			this.onExit(worker, code, signal)
		})

		//for (var i = 0; i < global.numProcesses; i++) 
		//	cluster.fork();

		this.started = true;
		
	}	
}





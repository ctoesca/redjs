"use strict";

const Timer = require('./Timer');
const Promise = require('bluebird');
const EventEmitter = require('events');
const DataManager = require('./DataManager');
const cluster = require('cluster');

module.exports = class RedjsServer extends EventEmitter {
	   
	constructor(opt){ 

		super();

		this.config = opt.config;
		this.logger = global.getLogger("RedjsServer");			
		this.logger.info("RedjsServer created");    
		this.server = null


		this._workers = {}
		
		this.mainTimer = new Timer({delay: 10000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		this.mainTimer.start()
		
		this.started = false;

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
				logger.debug("broadcast to worker "+cluster.workers[id].process.pid)
				cluster.workers[id].send( JSON.stringify(data) );
				r ++
			}
		})
		return r
	}

	onMessageFromWorker(msg, worker) 
	{
		//this.logger.error("MASTER.onMessageFromWorker PID="+ worker.process.pid, msg)

		var msg = JSON.parse( msg )

		try{
			
			var result = this.dataManager.execCommand(msg.cmd, worker, ...msg.args)
			var response = {
				id: msg.id,
				type: 'response',
				cmd: msg.cmd,
				workerPID: worker.process.pid,
				result: result
			}
		}catch(err)
		{
			//this.logger.error("MASTER."+msg.cmd +": "+err.toString()+". args=", msg.args)
			var response = {
				id: msg.id,
				type: 'error',
				cmd: msg.cmd,
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





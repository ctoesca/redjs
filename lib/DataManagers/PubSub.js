"use strict";

const Promise = require('bluebird');
const cluster = require('cluster');
const BaseDataManagers = require('./BaseDataManagers');

module.exports = class PubSub extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

		this.channels = {
		}

		cluster.on('exit', (worker, code, signal) => {

			for (let channel in this.channels)
			{
				if (this.channels[channel][worker.process.pid])
				{
					this.logger.info("RETRAIT LISTENER "+worker.process.pid+" sur channel "+channel)
					delete this.channels[channel][worker.process.pid]
				}
			}

		})
	}

	getCommandsNames(){
		return ["unsubscribe","subscribe","publish","PSUBSCRIBE", "PUBSUB", "PUNSUBSCRIBE" ]
	}

	unsubscribe(fromWorker, ...args){
		
		if ((args.length < 1) || (args[0] == undefined))
			throw "missing arguments"

		this.logger.debug("unsubscribe channel '"+args+"'")

		if (args.length == 0)
		{
			/* retrait de toutes les souscriptions pour ce worker */
			for (let channel in this.channels)
			{
				if (this.channels[channel][fromWorker.process.pid])
				{
					this.logger.info("RETRAIT LISTENER "+fromWorker.process.pid+" sur channel "+channel)
					delete this.channels[channel][fromWorker.process.pid]
				}
			}
		}
		else
		{			
			for (let i=0; i<args.length; i++)
			{
				var channel = args[i]
				if (typeof this.channels[channel] != "undefined")
					delete this.channels[channel][fromWorker.process.pid]	
			}
		}
	}

	subscribe(fromWorker, ...args){
		
		if ((args.length < 1) || (args[0] == undefined))
			throw "missing arguments"

		for (let i=0; i<args.length; i++)
		{
			var channel = args[i]
			if (typeof this.channels[channel] == "undefined")
				this.channels[channel] = {}

			this.channels[channel][fromWorker.process.pid] = fromWorker
		}
	}

	publish(fromWorker, ...args){

		if ((args.length < 2) || (args[0] == undefined) || (args[1] == undefined))
			throw "missing arguments: "+JSON.stringify(args)
		
		var channel = args[0]
		var msg = args[1]

		//this.logger.error("publish on '"+channel+"', msg="+msg)

		var r = this.master.broadcast(channel, msg, this.channels[channel])
		return r
	}

	onTimer(){
		
	}


}





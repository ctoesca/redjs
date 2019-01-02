"use strict";

const Promise = require('bluebird');
const cluster = require('cluster');
const BaseDataManagers = require('./BaseDataManagers');
const bunyan = require('bunyan');
const minimatch = require("minimatch")

module.exports = class PubSub extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

		this.channels = {
		}
		this.patternsSubscriptions = {
		}
		cluster.on('exit', (worker, code, signal) => {

			for (let channel in this.channels)
			{
				if (this.channels[channel][worker.process.pid])
				{
					delete this.channels[channel][worker.process.pid]
				}
			}

		})
	}

	static getCommandsNames(){
		return ["unsubscribe","subscribe","publish","PSUBSCRIBE", "PUBSUB", "PUNSUBSCRIBE" ]
	}

	match(value, pattern){
		return minimatch(value, pattern)
	}

	subscribe(request, ...channels){
		
		if ((channels.length < 1) || (channels[0] == undefined))
		{
			throw "ERR wrong number of arguments for 'psubscribe' command"		
		}else{
			for (let i=0; i<channels.length; i++)
			{
				var channel = channels[i]
				if (!this.channels[channel])
					this.channels[channel] = {}
				this.channels[channel][request.worker.process.pid] = request.worker
			}
		}

	}

	psubscribe(request, ...patterns)
	{
		if ((patterns.length < 1) || (patterns[0] == undefined))
		{
			throw "ERR wrong number of arguments for 'psubscribe' command"
		}else{
			for (let i=0; i<patterns.length; i++)
			{
				var pattern = patterns[i]

				if (!this.patternsSubscriptions[pattern])
					this.patternsSubscriptions[pattern] = {}
			
				this.patternsSubscriptions[pattern][request.worker.process.pid] = request.worker
	
			}
		}
	}

	unsubscribe(request, ...channels){
	
		if ((channels.length ==0) || (channels[0] == undefined))
		{			
			for (let channel in this.channels)
				delete this.channels[channel][request.worker.process.pid]
		}
		else
		{			
			for (let i=0; i<channels.length; i++)
			{
				var channel = channels[i]
				if (typeof this.channels[channel] != "undefined"){					
					delete this.channels[channel][request.worker.process.pid]	
				}
			}
		}
	}

	punsubscribe(request, ...patterns)
	{
		/*
		Unsubscribes the client from the given patterns, or from all of them if none is given.

		When no patterns are specified, the client is unsubscribed from all the previously subscribed patterns. 
		In this case, a message for every unsubscribed pattern will be sent to the client.
		*/

		if ((patterns.length ==0) || (patterns[0] == undefined)){
			for (let patternSubcription in this.patternsSubscriptions)
				delete this.patternsSubscriptions[patternSubcription][request.worker.process.pid]
		}else
		{			
			for (let i=0; i<patterns.length; i++)
			{
				var pattern = patterns[i]
				if (typeof this.patternsSubscriptions[pattern] != "undefined")	
					delete this.patternsSubscriptions[pattern][request.worker.process.pid]
			}
		}

	}


	publish(request, channel, message){

		if (arguments.length < 3)
			throw "invalid arguments. expects 'channel' 'message'"
		
		var r = 0

		var destWorkers = {}

		/* channels subscriptions */
		if (this.channels[channel]){
			destWorkers = this.channels[channel]
		}
		
		/* patterns subscriptions */
		for (let pattern in this.patternsSubscriptions)
		{
			if (this.match(channel, pattern))
			{
				for (let workerPid in this.patternsSubscriptions[pattern])
					destWorkers[workerPid] = this.patternsSubscriptions[pattern][workerPid]			
			}
		}	

		r += this.master.broadcast(channel, message, destWorkers)

		return r
	}

	onTimer(){
		
	}


}





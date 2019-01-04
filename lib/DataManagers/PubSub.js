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
		
	}

	static getCommandsNames(){
		return ["unsubscribe","subscribe","publish","PSUBSCRIBE", "PUBSUB", "PUNSUBSCRIBE" ]
	}

	match(value, pattern){
		return minimatch(value, pattern)
	}
	
	getSubscriptionsCount(conn){
		var r = 0
		for (var channel in this.channels)
		{
			for (let connId in this.channels[channel]){
				if (connId == conn.id)
					r ++
			}
		}
		for (var patternsSubscription in this.patternsSubscriptions)
		{
			for (let connId in this.patternsSubscriptions[patternsSubscription]){
				if (connId == conn.id)
					r ++
			}
		}
		return r
	}

	/*
	- subscribe: means that we successfully subscribed to the channel given as the second element in the reply. 
	The third argument represents the number of channels we are currently subscribed to.
	
	- unsubscribe: means that we successfully unsubscribed from the channel given as second element in the reply. 
	The third argument represents the number of channels we are currently subscribed to. When the last argument is zero, we are no longer subscribed to any channel, and the client can issue any kind of Redis command as we are outside the Pub/Sub state.
	*/

	subscribe(conn, ...channels){

		this.checkMinArgCount("subscribe", arguments, 2)
		var r = ['subscribe']

		if ((channels.length < 1) || (channels[0] == undefined))
		{
			throw "ERR wrong number of arguments for 'psubscribe' command"		
		}else{

			for (let i=0; i<channels.length; i++)
			{
				var channel = channels[i]
				if (!this.channels[channel])
					this.channels[channel] = {}
				this.channels[channel][conn.id] = conn
				r.push(channel)

				conn.on('close', () => {
					for (let channel in this.channels)
					{
						if (this.channels[channel][conn.id])
							delete this.channels[channel][conn.id]
					}
				})

			}
		}
		r.push( this.getSubscriptionsCount(conn) )
		return r
	}

	psubscribe(conn, ...patterns)
	{
		var r = ['psubscribe']

		this.checkMinArgCount("psubscribe", arguments, 2)

		if ((patterns.length < 1) || (patterns[0] == undefined))
		{
			throw "ERR wrong number of arguments for 'psubscribe' command"
		}else{
			for (let i=0; i<patterns.length; i++)
			{
				var pattern = patterns[i]

				if (!this.patternsSubscriptions[pattern])
					this.patternsSubscriptions[pattern] = {}
			
				this.patternsSubscriptions[pattern][conn.id] = conn
				r.push(pattern)
	
			}
		}
		
		r.push( this.getSubscriptionsCount(conn) )
		return r
	}

	unsubscribe(conn, ...channels){	
		
		var r = ['unsubscribe']

		this.checkMinArgCount("unsubscribe", arguments, 2)

		if ((channels.length ==0) || (channels[0] == undefined))
		{			
			for (let channel in this.channels){
				delete this.channels[channel][conn.id]
				r.push(channel)
			}
		}
		else
		{			
			for (let i=0; i<channels.length; i++)
			{
				var channel = channels[i]
				if (typeof this.channels[channel] != "undefined"){					
					delete this.channels[channel][conn.id]	
					r.push(channel)
				}
			}
		}
		
		r.push( this.getSubscriptionsCount(conn) )
		return r
	}

	punsubscribe(conn, ...patterns)
	{
		var r = ['punsubscribe']

		this.checkMinArgCount("punsubscribe", arguments, 2)

		/*
		Unsubscribes the client from the given patterns, or from all of them if none is given.

		When no patterns are specified, the client is unsubscribed from all the previously subscribed patterns. 
		In this case, a message for every unsubscribed pattern will be sent to the client.
		*/

		if ((patterns.length ==0) || (patterns[0] == undefined)){
			for (let patternSubcription in this.patternsSubscriptions){
				delete this.patternsSubscriptions[patternSubcription][conn.id]
				r.push(patternSubcription)
			}
		}else
		{			
			for (let i=0; i<patterns.length; i++)
			{
				var pattern = patterns[i]
				if (typeof this.patternsSubscriptions[pattern] != "undefined"){
					delete this.patternsSubscriptions[pattern][conn.id]
					r.push(pattern)
				}
			}
			
		}

		r.push( this.getSubscriptionsCount(conn) )
		return r
	}


	publish(conn, channel, message){

		this.checkArgCount("publish", arguments, 3)
		
		var r = 0

		var destConnections = {}

		/* channels subscriptions */
		if (this.channels[channel]){
			destConnections = this.channels[channel]
		}
		
		/* patterns subscriptions */
		for (let pattern in this.patternsSubscriptions)
		{
			if (this.match(channel, pattern))
			{
				for (let connId in this.patternsSubscriptions[pattern])
					destConnections[connId] = this.patternsSubscriptions[pattern][connId]			
			}
		}	

		r += this.server.broadcast(channel, message, destConnections)

		return r
	}

	onTimer(){
		
	}


}





"use strict";

const Timer = require('../Timer');
const Promise = require('bluebird');
const EventEmitter = require('events');

module.exports = class BaseDataManagers extends EventEmitter {
	   
	constructor(opt){ 

		super();

		this.config = opt;

		this.master = opt.master

		this.logger = global.getLogger(this.constructor.name);			
		this.logger.info(this.constructor.name+" created");    
	
		this.mainTimer = new Timer({delay: 10000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		//this.mainTimer.start()

		this.data = {
		}

	}

	getCommandsNames(){
		return []
	}

	getNewDataset(){
		return {}
		//return new Set();
	}
	getDataset(key)
	{
		var r = null
		if (typeof this.data[key] != "undefined")
			r = this.data[key]
		return r
	}

	getOrCreate(key){
		var r = this.getDataset( key )
		if (r == null){
			r = this.getNewDataset()
			this.data[key] = r
		}
		return r
	}

		
	onTimer(){
		
	}


}





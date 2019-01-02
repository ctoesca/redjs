"use strict";

const Timer = require('../../utils/Timer');
const Promise = require('bluebird');
const EventEmitter = require('events');
const bunyan = require('bunyan');

module.exports = class BaseDataManagers extends EventEmitter {
	   
	constructor(opt){ 

		super();

		this.config = opt;

		this.master = opt.master

		this.logger = bunyan.createLogger({ name: this.constructor.name });			
		this.logger.info(this.constructor.name+" created");    ;    
	
		this.mainTimer = new Timer({delay: 10000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		//this.mainTimer.start()

		this.data = {
		}

	}

	static getCommandsNames(){
		return []
	}

	getCommandsNames(){
		return this.constructor.getCommandsNames()
	}

	createNewKey( key ){
		this.data[key] = {}
		return this.data[key]
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
			r = this.createNewKey()
			this.data[key] = r
		}
		return r
	}

		
	onTimer(){
		
	}


}





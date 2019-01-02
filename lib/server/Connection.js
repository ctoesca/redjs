"use strict";

const Timer = require('../utils/Timer');
const Promise = require('bluebird');
const EventEmitter = require('events');
const cluster = require('cluster');
const bunyan = require('bunyan');

module.exports = class Connection extends EventEmitter {
	   
	constructor(opt){ 

		super();

		if (opt)
			this.config = opt

		this.logger = bunyan.createLogger({ name: this.constructor.name });			
		this.logger.info(this.constructor.name+" created");      
		
		this.mainTimer = new Timer({delay: 10000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		this.mainTimer.start()
		
	}
	
	onTimer(){

	}


}





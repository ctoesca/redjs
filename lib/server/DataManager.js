"use strict";

const Timer = require('../utils/Timer');
const EventEmitter = require('events');
const Promise = require('bluebird');
const bunyan = require('bunyan');

const Keys = require('./DataManagers/Keys');
const Hashes = require('./DataManagers/Hashes');
const PubSub = require('./DataManagers/PubSub');
const Lists = require('./DataManagers/Lists');
const Sets = require('./DataManagers/Sets');
const SortedSets = require('./DataManagers/SortedSets');

module.exports = class DataManager extends EventEmitter {
	   
	constructor(opt){ 

		super();

		this.config = opt;
		
		this.master = opt.master

		this.logger = bunyan.createLogger({ name: this.constructor.name });			
		this.logger.info(this.constructor.name+" created");      
	
		this.mainTimer = new Timer({delay: 10000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		//this.mainTimer.start()


		this.commands = {}

		/* HASHES */
		this.hashes = new Hashes({
			master: this.master
		})
		this.addComands( this.hashes )

		/* KEYS */
		this.keys = new Keys({
			master: this.master
		})
		this.addComands( this.keys )

		/* PUBSUB */
		this.pubsub = new PubSub({
			master: this.master
		})
		this.addComands( this.pubsub )

		/* LISTS */
		this.lists = new Lists({
			master: this.master
		})
		this.addComands( this.lists )

		/* SETS */
		this.sets = new Sets({
			master: this.master
		})
		this.addComands( this.sets )

		/* SortedSets */
		this.sortedSets = new SortedSets({
			master: this.master
		})
		this.addComands( this.sortedSets )

	}
	connect( request, opt=null ){
		return "OK"
	}

	addComands( manager )
	{
		var commandsNames = manager.getCommandsNames()
		for (var i=0; i<commandsNames.length; i++)
		{
			var commandName = commandsNames[i].toLowerCase()
			this.commands[commandName] = {
				manager: manager
			}
		}
	}

	execCommand(cmd, request, ...args){

		if (this[cmd]){
			return this[cmd](request, ...args)
		}else{
			var command = this.commands[cmd]
			return command.manager[cmd](request, ...args)
		}
	}

	onTimer(){
		
	}

}





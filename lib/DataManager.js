"use strict";

const Timer = require('./utils/Timer');
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
		
		this.server = opt.server

		this.logger = bunyan.createLogger({ name: this.constructor.name });			
		this.logger.info(this.constructor.name+" created");      
	
		this.mainTimer = new Timer({delay: 10000});
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer, this);
		//this.mainTimer.start()


		this.commands = {}

		/* HASHES */
		this.hashes = new Hashes({
			server: this.server
		})
		this.addComands( this.hashes )

		/* KEYS */
		this.keys = new Keys({
			server: this.server
		})
		this.addComands( this.keys )

		/* PUBSUB */
		this.pubsub = new PubSub({
			server: this.server
		})
		this.addComands( this.pubsub )

		/* LISTS */
		this.lists = new Lists({
			server: this.server
		})
		this.addComands( this.lists )

		/* SETS */
		this.sets = new Sets({
			server: this.server
		})
		this.addComands( this.sets )

		/* SortedSets */
		this.sortedSets = new SortedSets({
			server: this.server
		})
		this.addComands( this.sortedSets )

	}

	connect( conn, opt=null ){
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

	execCommand(cmd, conn, ...args){

		if (this.commands[cmd])
		{
			var command = this.commands[cmd]
			if (command.manager[cmd])
				return command.manager[cmd](conn, ...args)
			else
				throw "ERR '"+cmd+"' command is not implemented"
		}
		else if (typeof this[cmd] == 'function')
		{
			return this[cmd](conn, ...args)
		}else{
			throw "ERR Unknown command: '"+cmd+"'"
		}
	}

	onTimer(){
		
	}

}





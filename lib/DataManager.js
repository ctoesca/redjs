"use strict";

const Timer = require('./Timer');
const EventEmitter = require('events');
const Promise = require('bluebird');


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

		this.logger = global.getLogger("DataManager");			
		this.logger.info("DataManager created");    
	
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

	addComands( manager ){
		var hashesCommandsNames = manager.getCommandsNames()
		for (var i=0; i<hashesCommandsNames.length; i++)
		{
			var commandName = hashesCommandsNames[i].toLowerCase()
			this.commands[commandName] = {
				manager: manager
			}
		}
	}
	execCommand(cmd, fromWorker, ...args){
		var command = this.commands[cmd]
		return command.manager[cmd](fromWorker, ...args)
	}

	onTimer(){
		
	}

}





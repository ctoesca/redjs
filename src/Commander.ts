import {Timer} from './utils/Timer';
import Promise = require('bluebird');
import EventEmitter = require('events');
import net = require('net');

import {RedjsServer} from './RedjsServer';
import {Datastore} from './data/Datastore';

import {Connection} from './Connection';
import {Keys} from './Commands/Keys';
import {Hashes} from './Commands/Hashes';
import {PubSub} from './Commands/PubSub';
import {Lists} from './Commands/Lists';
import {Sets} from './Commands/Sets';
import {SortedSets} from './Commands/SortedSets';
import {ServerCommands} from './Commands/ServerCommands';
import {ConnectionCommands} from './Commands/ConnectionCommands';
import {StringsCommands} from './Commands/StringsCommands';


import {AbstractCommands} from './Commands/AbstractCommands'

export class Commander extends EventEmitter {

	protected config: any = null
	protected server: RedjsServer = null
	protected datastore: Datastore = null
	protected logger: any = null
	protected mainTimer: Timer = null
	protected commands: any = {}

	protected hashes: Hashes = null
	protected keys: Keys = null
	protected pubsub: PubSub = null
	protected sets: Sets = null
	protected sortedSets: SortedSets = null
	protected lists: Lists = null
	protected stringsCommands: StringsCommands = null
	protected connectionCommands: ConnectionCommands = null;
	protected serverCommands: ServerCommands = null;


	constructor(opt: any) {

		super();


		this.server = opt.server
		this.datastore = opt.datastore

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		/*
		this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		this.mainTimer.start()
		*/

		this.commands = {}

		let commandsManagers = [
			{name: 'hashes', clazz: Hashes},
			{name: 'keys', clazz: Keys},
			{name: 'pubsub', clazz: PubSub},
			{name: 'lists', clazz: Lists},
			{name: 'sets', clazz: Sets},
			{name: 'sortedSets', clazz: SortedSets},
			{name: 'serverCommands', clazz: ServerCommands},
			{name: 'connectionCommands', clazz: ConnectionCommands},
			{name: 'stringsCommands', clazz: StringsCommands}
		]

		for (let commandManager of commandsManagers) {
			this[commandManager.name] = new commandManager.clazz({
				server: this.server,
				datastore: this.datastore
			})
			this.addComands( this[commandManager.name] )
		}

	}

	public execCommand(cmd: string, conn: Connection, ...args: any[]) {

		if (this.commands[cmd]) {
			let command = this.commands[cmd]
			if (command.manager[cmd]) {
				command.manager.checkArgs( cmd, ...args )
				return command.manager[cmd](conn, ...args)
			} else {
				throw 'ERR \'' + cmd + '\' command is not implemented'
			}
		} else {
			throw 'ERR Unknown command: \'' + cmd + '\''
		}
	}

	protected addComands( manager: AbstractCommands ) {

		let commandsNames = manager.getCommandsNames()

		for (let i = 0; i < commandsNames.length; i ++) {
			let commandName = commandsNames[i].toLowerCase()

			this.commands[commandName] = {
				manager: manager
			}
		}
	}
	/* protected onTimer() {

	} */

}



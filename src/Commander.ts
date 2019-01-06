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

		/* this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		this.mainTimer.start() */


		this.commands = {}

		/* HASHES */
		this.hashes = new Hashes({
			server: this.server,
			datastore: this.datastore
		})
		this.addComands( this.hashes )

		/* KEYS */
		this.keys = new Keys({
			server: this.server,
			datastore: this.datastore
		})
		this.addComands( this.keys )

		/* PUBSUB */
		this.pubsub = new PubSub({
			server: this.server,
			datastore: this.datastore
		})
		this.addComands( this.pubsub )

		/* LISTS */
		this.lists = new Lists({
			server: this.server,
			datastore: this.datastore
		})
		this.addComands( this.lists )

		/* SETS */
		this.sets = new Sets({
			server: this.server,
			datastore: this.datastore
		})
		this.addComands( this.sets )

		/* SortedSets */
		this.sortedSets = new SortedSets({
			server: this.server,
			datastore: this.datastore
		})
		this.addComands( this.sortedSets )

		/* Server */
		this.serverCommands = new ServerCommands({
			server: this.server,
			datastore: this.datastore
		})
		this.addComands( this.serverCommands )

		/* Server */
		this.connectionCommands = new ConnectionCommands({
			server: this.server,
			datastore: this.datastore
		})
		this.addComands( this.connectionCommands )

		/* StringsCommands */
		this.stringsCommands = new StringsCommands({
			server: this.server,
			datastore: this.datastore
		})
		this.addComands( this.stringsCommands )

	}

	public execCommand(cmd: string, conn: Connection, ...args: any[]) {

		if (this.commands[cmd]) {
			let command = this.commands[cmd]
			if (command.manager[cmd]) {
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



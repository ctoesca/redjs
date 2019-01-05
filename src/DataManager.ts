import {Timer} from './utils/Timer';
import Promise = require('bluebird');
import EventEmitter = require('events');
import bunyan = require('bunyan');
import net = require('net');

import {Connection} from './Connection';
import {Keys} from './DataManagers/Keys';
import {Hashes} from './DataManagers/Hashes';
import {PubSub} from './DataManagers/PubSub';
import {Lists} from './DataManagers/Lists';
import {Sets} from './DataManagers/Sets';
import {SortedSets} from './DataManagers/SortedSets';
import {BaseDataManagers} from './DataManagers/BaseDataManagers'

export class DataManager extends EventEmitter {

	protected config: any = null
	protected server: net.Server = null
	protected logger: bunyan = null
	protected mainTimer: Timer = null
	protected commands: any = {}

	protected hashes: Hashes = null
	protected keys: Keys = null
	protected pubsub: PubSub = null
	protected sets: Sets = null
	protected sortedSets: SortedSets = null
	protected lists: Lists = null

	constructor(opt: any) {

		super();

		this.config = opt;

		this.server = opt.server

		let constructor: any = this.constructor
		this.logger = bunyan.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		// this.mainTimer.start()


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

	public execCommand(cmd: string, conn: Connection, ...args: any[]) {

		if (this.commands[cmd]) {
			let command = this.commands[cmd]
			if (command.manager[cmd]) {
				return command.manager[cmd](conn, ...args)
			} else {
				throw 'ERR \'' + cmd + '\' command is not implemented'
			}
		} else if (typeof this[cmd] === 'function') {
			return this[cmd](conn, ...args)
		} else {
			throw 'ERR Unknown command: \'' + cmd + '\''
		}
	}

	protected connect(conn: Connection, opt: any = null) {
		return 'OK'
	}

	protected addComands( manager: BaseDataManagers ) {

		let commandsNames = manager.getCommandsNames()

		for (let i = 0; i < commandsNames.length; i ++) {
			let commandName = commandsNames[i].toLowerCase()

			this.commands[commandName] = {
				manager: manager
			}
		}
	}

	protected onTimer() {

	}

}



import {Timer} from './utils/Timer';
import Promise = require('bluebird');
import EventEmitter = require('events');
import net = require('net');

import {RedjsServer} from './RedjsServer';
import {Datastore} from './data/Datastore';

import {Connection} from './Connection';
import {KeysCommands} from './Commands/KeysCommands';
import {HashesCommands} from './Commands/HashesCommands';
import {PubSubCommands} from './Commands/PubSubCommands';
import {ListsCommands} from './Commands/ListsCommands';
import {SetsCommands} from './Commands/SetsCommands';
import {SortedSetsCommnands} from './Commands/SortedSetsCommnands';
import {ServerCommands} from './Commands/ServerCommands';
import {ConnectionCommands} from './Commands/ConnectionCommands';
import {StringsCommands} from './Commands/StringsCommands';
import {TransactionsCommand} from './Commands/TransactionsCommand';
import {ClusterCommands} from './Commands/ClusterCommands';
import {GeoCommands} from './Commands/GeoCommands';
import {HyperLogLogCommands} from './Commands/HyperLogLogCommands';
import {ScriptingCommands} from './Commands/ScriptingCommands';
import {StreamsCommands} from './Commands/StreamsCommands';




import {RedisError} from './Errors/RedisError'
import {NotImplementedError} from './Errors/NotImplementedError'

import {AbstractCommands} from './Commands/AbstractCommands'

export class Commander extends EventEmitter {

	protected config: any = null
	protected server: RedjsServer = null
	protected datastore: Datastore = null
	protected logger: any = null
	//protected mainTimer: Timer = null
	protected commands: any = {}

	protected hashesCommands: HashesCommands = null
	protected keysCommands: KeysCommands = null
	protected pubsubCommands: PubSubCommands = null
	protected setsCommands: SetsCommands = null
	protected sortedSetsCommnand: SortedSetsCommnands = null
	protected listsCommands: ListsCommands = null
	protected stringsCommands: StringsCommands = null
	protected connectionCommands: ConnectionCommands = null;
	protected serverCommands: ServerCommands = null;
	protected transactionsCommands: TransactionsCommand = null;
	protected clusterCommands: ClusterCommands = null;
	protected geoCommands: GeoCommands = null;
	protected hyperLogLogCommands: HyperLogLogCommands = null;
	protected scriptingCommands: ScriptingCommands = null;
	protected streamsCommands: StreamsCommands = null;
	protected sortedSetsCommnands: SortedSetsCommnands = null


	constructor(opt: any) {

		super();


		this.server = opt.server
		this.datastore = opt.datastore

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		this.commands = {}

		let commandsManagers = [
			{name: 'hashesCommands', clazz: HashesCommands},
			{name: 'keysCommands', clazz: KeysCommands},
			{name: 'pubsubCommands', clazz: PubSubCommands},
			{name: 'listsCommands', clazz: ListsCommands},
			{name: 'setsCommands', clazz: SetsCommands},
			{name: 'sortedSetsCommnands', clazz: SortedSetsCommnands},
			{name: 'serverCommands', clazz: ServerCommands},
			{name: 'connectionCommands', clazz: ConnectionCommands},
			{name: 'stringsCommands', clazz: StringsCommands},
			{name: 'transactionsCommands', clazz: TransactionsCommand},
			{name: 'clusterCommands', clazz: ClusterCommands},
			{name: 'geoCommands', clazz: GeoCommands},
			{name: 'hyperLogLogCommands', clazz: HyperLogLogCommands},
			{name: 'scriptingCommands', clazz: ScriptingCommands},
			{name: 'streamsCommands', clazz: StreamsCommands}
		]

		for (let commandManager of commandsManagers) {
			this[commandManager.name] = new commandManager.clazz({
				server: this.server,
				datastore: this.datastore
			})
			this.addCommands( this[commandManager.name] )
		}

	}

	public execCommand(conn: Connection, checkOnly = false, cmd: string, ...args: any[]) {

		if (this.commands[cmd]) {
			let command = this.commands[cmd]
			if (command.manager[cmd]) {
				command.manager['check_' + cmd](conn, ...args )
				if (!checkOnly) {
					return command.manager[cmd](conn, ...args)
				}
			} else {
				throw new NotImplementedError(cmd)
			}
		} else {
			throw new RedisError( 'ERR Unknown command: \'' + cmd + '\'')
		}
	}

	protected addCommands( manager: AbstractCommands ) {

		let commandsNames = manager.getCommandsNames()
		let notImplementedCommands = manager.getNotImplementedCommands()

		for (let i = 0; i < commandsNames.length; i ++) {
			let commandName = commandsNames[i]
			if (!manager[commandName] ) {
				manager[commandName] = (conn: Connection) => {
					throw new NotImplementedError( commandName )
				}
			}
			this.commands[commandName] = {
				manager: manager
			}
		}


		for (let i = 0; i < notImplementedCommands.length; i ++) {

			let commandName = notImplementedCommands[i]
			manager[commandName] = (conn: Connection) => {
				throw new NotImplementedError(commandName)
			}
			this.commands[commandName] = {
				manager: manager
			}

		}

	}
	/* protected onTimer() {

	} */

}



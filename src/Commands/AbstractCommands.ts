
import {Timer} from '../utils/Timer';
import {RedjsServer} from '../RedjsServer';
import {Datastore} from '../Data/Datastore';
import {Database} from '../Data/Database';

import Promise = require('bluebird');
import EventEmitter = require('events');
import net = require('net');
import minimatch = require('minimatch')

export class AbstractCommands extends EventEmitter {

	protected config: any = null
	protected server: RedjsServer
	protected datastore: Datastore = null
	protected logger: any = null
	protected mainTimer: Timer = null
	protected data: any = {}

	constructor(opt: any) {

		super();

		this.server = opt.server
		this.datastore = opt.datastore

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		// this.mainTimer.start()

	}

	public getCommandsNames(): string[] {
		return []
	}

	protected checkArgCount(cmd: string, args: IArguments, expected: number) {
		if (args.length !== expected) {
			throw new Error('ERR wrong number of arguments for \'' + cmd + '\' command')
		}
	}

	protected checkMinArgCount(cmd: string, args: IArguments, expected: number) {
		if (args.length < expected) {
			throw new Error('ERR wrong number of arguments for \'' + cmd + '\' command')
		}
	}


	protected createNewKey(db: Database, key: string ) {
		return db.createNewKey( key, {} )
	}

	protected getDataset(db: Database, key: string) {
		return db.getDataset(key)
	}

	protected getOrCreate( db: Database, key: string ) {
		let r = this.getDataset( db, key )
		if (!r) {
			r = this.createNewKey( db, key )
		}
		return r
	}

	protected match(value: string, pattern: string) {
		return minimatch(value, pattern)
	}

	protected onTimer() {

	}
}

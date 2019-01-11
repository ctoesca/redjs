
import * as utils from '../utils';
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
	protected mainTimer: utils.Timer = null
	protected data: any = {}

	constructor(opt: any) {

		super();

		this.server = opt.server
		this.datastore = opt.datastore

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		/* this.mainTimer = new utils.Timer({delay: 10000})
		this.mainTimer.on(utils.Timer.ON_TIMER, this.onTimer.bind(this))
		this.mainTimer.start() */

	}

	public destroy() {
		this.removeAllListeners()
	}
	public checkArgs(cmd: string, ...args: any[]) {
		// console.log(cmd, args)
	}
	public getCommandsNames(): string[] {
		return []
	}
	protected checkType( obj: any, type: any) {
		if (obj && !(obj instanceof type)) {
			throw 'WRONGTYPE Operation against a key holding the wrong kind of value'
		}
	}
	protected checkArgCount(cmd: string, args: IArguments, valueOrMin: number, max = -1) {
		if (arguments.length === 3) {
			if (args.length !== valueOrMin) {
				throw new Error('ERR wrong number of arguments for \'' + cmd + '\' command')
			}
		} else if ( (args.length < valueOrMin) || ((args.length > max) && (max > -1)) ) {
			throw new Error('ERR wrong number of arguments for \'' + cmd + '\' command')
		}

	}
	protected checkInt( v: any ) {
		if (!utils.isInt(v)) {
			throw 'ERR value is not an integer or out of range'
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

	/* protected onTimer() {

	} */
}

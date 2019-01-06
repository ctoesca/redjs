import {Timer} from '../utils/Timer';
import {Datastore} from './Datastore';
import {RedjsServer} from '../RedjsServer';
import Promise = require('bluebird');
import EventEmitter = require('events');
import net = require('net');

import {Connection} from '../Connection';

export class Database extends EventEmitter {

	public keys: Map<string, any> = new Map<string, any>()

	protected config: any = null
	protected server: net.Server = null
	protected logger: any = null
	protected mainTimer: Timer = null
	protected datastore: Datastore = null


	constructor(opt: any) {

		super();

		this.config = opt;

		this.server = opt.server
		this.datastore = opt.datastore

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		// this.mainTimer.start()

	}

	public clear() {
		return this.keys.clear()
	}

	public createNewKey( key: string, object: any ) {
		this.keys.set(key, object)
		return object;
	}
	public getDataset( key: string) {
		return this.keys.get(key)
	}

	protected onTimer() {

	}

}



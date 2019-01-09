import {Timer} from '../utils/Timer';
import {Database} from './Database';
import {RedjsServer} from '../RedjsServer';
import Promise = require('bluebird');
import EventEmitter = require('events');
import net = require('net');
import * as utils from '../utils';

export class Datastore extends EventEmitter {

	protected config: any = null
	protected server: net.Server = null
	protected logger: any = null
	protected mainTimer: Timer = null

	protected databases: Database[] = []

	constructor(opt: any) {

		super();

		this.config = opt;

		this.server = opt.server

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		/* this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		this.mainTimer.start() */

		for (let i = 0; i < 10; i++) {
			this.databases.push( new Database({
				server: this.server,
				datastore: this,
				index: i
			}))
		}
	}

	public getDb(index = 0) {

		if ( !utils.isInt(index) || (index >= this.databases.length ))
			throw 'ERR value is not an integer or out of range'

		return this.databases[index]
	}
	clear(){
		for (let db of this.databases) {
			db.clear()
		}
	}
	/* protected onTimer() {

	}
	*/

}



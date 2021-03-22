import {Timer} from '../utils/Timer';
import {Datastore} from './Datastore';
import {RedjsServer} from '../RedjsServer';
import Promise = require('bluebird');
import EventEmitter = require('events');
import net = require('net');
import * as utils from '../utils';
const fs = require('fs-extra');
import {Connection} from '../Connection';
import {IDataset} from './IDataset'
import {HashDataset} from './HashDataset'
import {ListDataset} from './ListDataset'
import {SetDataset} from './SetDataset'
import {StringsDataset} from './StringsDataset'

export class Database extends EventEmitter {

	public keys: Map<string, any> = new Map<string, any>()

	protected config: any = null
	protected server: net.Server = null
	protected logger: any = null
	protected mainTimer: Timer = null
	protected datastore: Datastore = null
	protected index = 0


	constructor(opt: any) {

		super();

		this.config = opt;

		this.server = opt.server
		this.datastore = opt.datastore
		this.index = opt.index

		let constructor: any = this.constructor
		this.logger = RedjsServer.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		/* this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		this.mainTimer.start() */

	}
	public getIndex() {
		return this.index
	}
	public clear() {
		return this.keys.clear()
	}

	public createHashDataset(key: string): HashDataset {
		let r = new HashDataset()
		this.keys.set(key, r)
		return r
	}

	public createListDataset(key: string): ListDataset {
		let r = new ListDataset()
		this.keys.set(key, r)
		return r
	}

	public createSetDataset(key: string): SetDataset {
		let r = new SetDataset()
		this.keys.set(key, r)
		return r
	}

	public createStringsDataset(key: string): StringsDataset {
		let r = new StringsDataset()
		this.keys.set(key, r)
		return r
	}

	public getDataset( key: string) {
		return this.keys.get(key)
	}
	public save(path: string) {
		let data = {}
		this.keys.forEach((value, key, index) => {
			data[key] = value
			this.logger.error('value', value)
		})
		fs.writeFileSync(path, JSON.stringify(data, null, 4))
	}

	/* protected onTimer() {

	} */

}



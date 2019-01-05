
import {Timer} from '../utils/Timer';
import {RedjsServer} from '../RedjsServer';
import Promise = require('bluebird');
import bunyan = require('bunyan');
import EventEmitter = require('events');
import net = require('net');

export class BaseDataManagers extends EventEmitter {

	protected config: any = null
	protected server: RedjsServer
	protected logger: bunyan = null
	protected mainTimer: Timer = null
	protected data: any = {}

	constructor(opt: any) {

		super();

		this.config = opt
		this.server = opt.server

		let constructor: any = this.constructor
		this.logger = bunyan.createLogger({ name: constructor.name })
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


	protected createNewKey( key: string ) {
		this.data[key] = {}
		return this.data[key]
	}

	protected getDataset(key: string) {
		let r = null
		if (typeof this.data[key] !== 'undefined') {
			r = this.data[key]
		}
		return r
	}

	protected getOrCreate( key: string ) {
		let r = this.getDataset( key )
		if (r == null) {
			r = this.createNewKey( key )
		}
		return r
	}

	protected onTimer() {

	}
}

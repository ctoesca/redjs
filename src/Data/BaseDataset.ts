
import {Connection} from '../Connection';
import Promise = require('bluebird');
import EventEmitter = require('events');

export class BaseDataset extends EventEmitter {


	constructor(opt: any) {
		super();
	}

	public getCommandsNames(): string[] {
		return []
	}

}

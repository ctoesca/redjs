
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

}

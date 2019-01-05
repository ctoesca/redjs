import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import * as utils from '../utils';
import Promise = require('bluebird');

export class ConnectionCommands extends AbstractCommands {

	constructor(opt: any) {
		super(opt)
	}

	public getCommandsNames(): string[] {
		return ['ping']
	}

	public ping( conn: Connection, responseExpected: string = null) {
		let r = 'PONG'
		if (responseExpected) {
			r = responseExpected
		}
		return r
	}


}

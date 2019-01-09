import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import * as utils from '../utils';
import Promise = require('bluebird');

export class ConnectionCommands extends AbstractCommands {

	constructor(opt: any) {
		super(opt)
	}

	public getCommandsNames(): string[] {
		return ['ping', 'auth', 'echo', 'quit', 'select', 'swapdb']
	}

	public ping( conn: Connection, responseExpected: string = null) {
		this.checkArgCount('echo', arguments, 1, 2)
		let r = 'PONG'
		if (responseExpected) {
			r = responseExpected
		}
		return {
			type: 'simpleString',
			value: r
		}
	}

	public select ( conn: Connection, index = 0) {
	
		this.checkArgCount('echo', arguments, 2)
		conn.setDatabase(index)
		let r = 'OK'
		return {
			type: 'simpleString',
			value: r
		}
	}

	public auth( conn: Connection, password: string) {
		// !!
		this.checkArgCount('auth', arguments, 2)
		let r = 'OK'
		return {
			type: 'simpleString',
			value: r
		}
	}
	public echo( conn: Connection, message: string) {

		this.checkArgCount('echo', arguments, 2)
		let r = message
		return {
			type: 'simpleString',
			value: r
		}
	}
	public quit( conn: Connection) {
		/* !!
		Ask the server to close the connection. The connection is closed as soon as all pending replies have been written to the client.
		-> ASYNC...
		*/

		conn.quit()

		let r = 'OK'
		return {
			type: 'simpleString',
			value: r
		}
	}

}

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
		// !!
		this.checkArgCount('echo', arguments, 2)
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
		// !!
		conn.on('close', () => {
			console.log('Connection closed')
		})
		conn.quit()
		
		let r = "OK"
		return {
			type: 'simpleString',
			value: r
		}
	}

}

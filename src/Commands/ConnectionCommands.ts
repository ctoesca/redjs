import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import * as utils from '../utils';
import Promise = require('bluebird');
import {IDataset} from '../Data/IDataset'
import {RedisError} from '../Errors/RedisError'

export class ConnectionCommands extends AbstractCommands {

	constructor(opt: any) {
		super(opt)
	}

	public getCommandsNames(): string[] {
		return ['ping', 'auth', 'echo', 'quit', 'select']
	}
	public getNotImplementedCommands(): string[] {
		return [
		'client', // caching getname getredir id info kill list pause reply setname tracking trackinginfo unblock unpause
		'hello',
		'reset'
		]
	}

	public check_ping( conn: Connection, responseExpected: string = null) {
		this.checkArgCount('echo', arguments, 1, 2)
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

	public check_select ( conn: Connection, index = 0) {
		this.checkArgCount('echo', arguments, 2)
	}
	public select ( conn: Connection, index = 0) {

		conn.setDatabase(index)
		return 'OK'
	}

	public check_auth( conn: Connection, password: string) {	
		this.checkArgCount('auth', arguments, 2)
	}
	public auth( conn: Connection, password: string) {
		throw new RedisError("ERR Client sent AUTH, but no password is set")
	}

	public check_echo( conn: Connection, message: string) {
		this.checkArgCount('echo', arguments, 2)
	}
	public echo( conn: Connection, message: string) {

		let r = message
		return {
			type: 'simpleString',
			value: r
		}
	}

	public check_quit( conn: Connection) {
		this.checkArgCount('quit', arguments, 1)
	}
	public quit( conn: Connection) {
		/* !!
		Ask the server to close the connection. The connection is closed as soon as all pending replies have been written to the client.
		-> ASYNC...
		*/
		conn.quit()
		return 'OK'

	}

}

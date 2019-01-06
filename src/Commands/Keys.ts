import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import * as utils from '../utils';
import {Database} from '../data/Database';
import Promise = require('bluebird');


export class Keys extends AbstractCommands {

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return ['DEL', 'DUMP', 'EXISTS', 'EXPIRE', 'EXPIREAT', 'KEYS', 'MIGRATE', 'MOVE', 'OBJECT', 'PERSIST',
		'PEXPIRE', 'PEXPIREAT', 'PTTL', 'RANDOMKEY', 'RENAME', 'RENAMENX', 'RESTORE', 'SORT', 'TOUCH', 'TTL', 'TYPE', 'UNLINK', 'WAIT', 'SCAN']
	}


	public get( conn: Connection, key: string) {
		return conn.database.keys.get(key)
	}

	public set( conn: Connection, key: string, object: any ) {
		if (conn.database.keys.has(key)) {
			throw 'key \'' + key + ' already exists'
		}
		conn.database.keys.set(key, object)
		return object
	}

	/* -------------------------------------------------------------------------------------- */


	public scan(conn: Connection, cursor: number, MATCH: string, pattern: string, COUNT: string, count: number) {
		/* SCAN cursor [MATCH pattern] [COUNT count]
		ex : scan 0 MATCH * COUNT 10000 */

		// !!

		this.checkArgCount('scan', arguments, 6)

		let r: any[] = [0, []]

		conn.database.keys.forEach( ( value: any, key: string ) => {
			if (this.match(key, pattern)) {
				r[1].push( key )
			}
		})

		return r
	}

	public del(conn: Connection, key: string, ...keys: string[]) {
		this.checkMinArgCount('get', arguments, 2)
		let r = 0
		if (conn.database.keys.has(key)) {
			conn.database.keys.delete(key)
			r ++
		}
		for (let i = 0; i < keys.length; i ++) {
			if (conn.database.keys.has(keys[i])) {
				conn.database.keys.delete(keys[i])
				r ++
			}
		}
		return r
	}

	public exists(conn: Connection, key: string, ...keys: string[]) {
		this.checkMinArgCount('exists', arguments, 2)
		let r = 0
		if (conn.database.keys.has(key)) {
			r = 1
		}

		for (let i = 0; i < keys.length; i ++) {
			if (conn.database.keys.has(keys[0])) {
				r ++
			}
		}
		return r
	}

	public keys(conn: Connection, pattern: string) {
		this.checkArgCount('keys', arguments, 2)

		let r: string[] = []

		conn.database.keys.forEach( ( value: any, key: string ) => {
			if (this.match(key, pattern)) {
				r.push( key)
			}
		})

		return r
	}

	protected onTimer() {

	}
}

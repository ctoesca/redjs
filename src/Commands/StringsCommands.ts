import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import * as utils from '../utils';

import {Database} from '../data/Database';
import Promise = require('bluebird');

export class StringsCommands extends AbstractCommands {

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return ['APPEND', 'BITCOUNT', 'BITFIELD', 'BITOP', 'BITPOS', 'DECR', 'DECRBY', 'GET', 'GETBIT', 'GETRANGE',
		'GETSET', 'INCR', 'INCRBY', 'INCRBYFLOAT', 'MGET', 'MSET', 'MSETNX', 'PSETEX', 'SET', 'SETBIT', 'SETEX', 'SETNX', 'SETRANGE', 'STRLEN']
	}

	public get(conn: Connection, key: string) {

		this.checkArgCount('get', arguments, 2)

		let r = null
		let data = this.getDataset(conn.database, key)
		if (data) {
			r = data.value
		}

		return r
	}

	public set(conn: Connection, key: string, value: string, ...options: any[]) {
		/* SET key value [expiration EX seconds|PX milliseconds] [NX|XX]

		Set key to hold the string value. If key already holds a value, it is overwritten, regardless of its type. Any previous time to live associated with the key is discarded on successful SET operation.

		Options
		Starting with Redis 2.6.12 SET supports a set of options that modify its behavior:

		EX seconds -- Set the specified expire time, in seconds.
		PX milliseconds -- Set the specified expire time, in milliseconds.
		NX -- Only set the key if it does not already exist.
		XX -- Only set the key if it already exist.
		Note: Since the SET command options can replace SETNX, SETEX, PSETEX, it is possible that in future versions of Redis these three commands will be deprecated and finally removed.

		Return value
		Simple string reply: OK if SET was executed correctly.
		Null reply: a Null Bulk Reply is returned if the SET operation was not performed because the user specified the NX or XX option but the condition was not met.

		*/

		this.checkArgCount('set', arguments, 3, -1)

		let r = 'OK'
		let data = this.getOrCreate(conn.database, key)
		data.value = value
		return r
	}


	public incr(conn: Connection, key: string) {
		this.checkArgCount('exists', arguments, 2)

		let data = this.getDataset(conn.database, key)
		if (data) {
			if (!utils.isInt(data.value)) {
				throw 'ERR value is not an integer or out of range'
			}
		} else {
			data = this.createNewKey(conn.database, key)
			data.value = 0
		}

		data.value ++
		return data.value
	}

	protected createNewKey( db: Database, key: string ) {
		return db.createNewKey( key, {value: ''} )
	}

}

import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import * as utils from '../utils';
import {IDataset} from '../Data/IDataset'
import {Database} from '../data/Database';
import Promise = require('bluebird');
import {StringsDataset} from '../Data/StringsDataset'
import {RedisError} from '../Errors/RedisError'
import {NotImplementedError} from '../Errors/NotImplementedError'

export class StringsCommands extends AbstractCommands {

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return [
		'get',
		'strlen',
		'set',
		'incr'
		]
	}

	public getNotImplementedCommands(): string[] {
		return [
		'append',
		'bitcount',
		'bitfield',
		'bitop',
		'bitpos',
		'decr',
		'decrby',
		'getbit',
		'getdel',
		'getex',
		'getrange',
		'getset',
		'incrby',
		'incrbyfloat',
		'mget',
		'mset',
		'msetnx',
		'psetex',
		'setbit',
		'setex',
		'setnx',
		'setrange',
		'stralgo'
		]
	}

	public check_strlen( conn: Connection, key: string ) {
		this.checkArgCount('strlen', arguments, 2)
	}
	public strlen(conn: Connection, key: string) {

		let data: StringsDataset = this.getDataset(conn.database, key)
		if (!data) {
			return 0;
		}

		let r = 0
		if (typeof data.value !== 'string') {
			throw new RedisError(  'ERR value is not a string or out of range' )
		}

		r = data.value.length

		return r
	}

	public check_get( conn: Connection, key: string ) {
		this.checkArgCount('get', arguments, 2)
	}
	public get(conn: Connection, key: string) {
		let r = null
		let data: StringsDataset = this.getDataset(conn.database, key)
		if (data) {
			r = data.value
		}

		return r
	}

	public check_set( conn: Connection, key: string, value: any, ...options: any[] ) {
		this.checkArgCount('set', arguments, 3, -1)
	}
	public set(conn: Connection, key: string, value: any, ...options: any[]) {
		if (options.length > 0) {
			throw new NotImplementedError('set with options')
		}
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

		let data: StringsDataset = this.getOrCreate(conn.database, key)
		data.value = value
		return 'OK'
	}

	public check_incr( conn: Connection, key: string ) {
		this.checkArgCount('incr', arguments, 2)
	}
	public incr(conn: Connection, key: string) {

		let data: StringsDataset = this.getDataset(conn.database, key)
		if (data) {
			if (!utils.isInt(data.value)) {
				throw new RedisError( 'ERR value is not an integer or out of range' )
			}
		} else {
			data = this.createNewKey(conn.database, key)
			data.value = 0
		}

		data.value ++
		return data.value
	}

	protected getDataset(db: Database, key: string): StringsDataset {
		let r = db.getDataset(key)
		this.checkType(r, StringsDataset)
		return r
	}

	protected createNewKey( db: Database, key: string ): StringsDataset {
		return db.createStringsDataset( key )
	}

}

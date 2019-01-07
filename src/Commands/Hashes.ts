import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import {Database} from '../data/Database';
import * as utils from '../utils';
import Promise = require('bluebird');

export class Hashes extends AbstractCommands {

	protected clientsCursors: any = {}
	protected defaultScancount = 10
	protected lastCursorId = 1;

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return ['hget', 'hset', 'HDEL', 'HEXISTS', 'HGETALL', 'HINCRBY', 'HINCRBYFLOAT',
		'HKEYS', 'HLEN', 'HMGET', 'HMSET', 'HSETNX', 'HSTRLEN', 'HVALS', 'HSCAN']
	}

	public hscan(conn: Connection, key: string, cursor: number, ...options: any[]): string	{
		// options:  [MATCH pattern] [COUNT count]

		this.checkArgCount('hscan', arguments, 3, 7)

		let argsNames = ['match', 'count']
		let args: any = {}

		try {
			if (options.length > argsNames.length * 2) {
				throw 'ERR Too many arguments'
			}
			if (options.length % 2 !== 0) {
				throw 'ERR Invalid arguments count'
			}

			for (let i = 0; i < options.length; i ++ ) {
				let opt = options[i]

				if (typeof opt === 'string') {
					opt = opt.toLowerCase()
				}

				if (argsNames.indexOf(opt) >= 0) {
					if (typeof args[opt] !== 'undefined') {
						throw 'ERR Argument \'' + opt + '\' defined twice'
					}

					args[opt] = options[i + 1]
				} else {
					throw 'ERR unknown argument: \'' + opt + '\''
				}

				i ++
			}

		} catch (err) {
			let invalidArgumentsError = new Error('Invalid arguments: ' + err.toString() + '. Syntax: hscan key cursor [MATCH pattern] [COUNT count]')
			throw invalidArgumentsError
		}

		let cursorObject: any
		if (cursor === 0) {
			this.lastCursorId ++

			cursorObject = {
				id: this.lastCursorId,
				position: 0
			}
			if (!this.clientsCursors[conn.id]) {
				this.clientsCursors[conn.id] = {}
			}

			this.clientsCursors[conn.id][cursorObject.id] = cursorObject

		} else {
			if (!this.clientsCursors[conn.id] || !this.clientsCursors[conn.id][cursor]) {
				throw 'Cursor \'' + cursor + '\' does not exit'
			}

			cursorObject = this.clientsCursors[conn.id][cursor]
		}

		console.log('key=' + key + ', cursor=' + cursor + ', options=', args, 'cursorObject=', cursorObject)
		throw 'ERR Not yet implemented'

		// return 'OK'
	}

	public hget(conn: Connection, key: string, field: string) {

		this.checkArgCount('hget', arguments, 3)

		let r = null
		let h: Map<string, any> = this.getDataset(conn.database, key)
		if (h && h.has(field)) {
			r = h.get(field)
		}
		return r
	}

	public hvals(conn: Connection, key: string): any[] {
		this.checkArgCount('hvals', arguments, 2)

		let h: Map<string, any> = this.getDataset(conn.database, key)
		let r: any[] = []
		if (h) {
			h.forEach( ( value: any, field: string ) => {
				r.push( value )
			})
		}
		return r
	}

	public hstrlen(conn: Connection, key: string, field: string) {

		this.checkArgCount('hstrlen', arguments, 3)

		let h: Map<string, any> = this.getDataset(conn.database, key)

		let r = 0
		if ( h && h.has(field)) {
			let value = h.get(field)
			if ( value !== null) {
				r = value.toString().length
			}
		}

		return r
	}

	public hset(conn: Connection, key: string, field: string, value: string) {

		this.checkArgCount('hset', arguments, 4)

		let h: Map<string, any> = this.getOrCreate(conn.database, key)

		let r = 0
		if (!h.has(field)) {
			r = 1
		}

		h.set(field, value)

		return r
	}

	public hsetnx(conn: Connection, key: string, field: string, value: string) {

		this.checkArgCount('hsetnx', arguments, 4)

		let h: Map<string, any> = this.getDataset(conn.database, key)
		let r = 0
		if (!h) {
			h = this.createNewKey(conn.database, key)
			r = 1;
		}
		if (!h.has(field)) {
			r = 1
			h.set(field, value)
		}
		return r
	}

	public hmget(conn: Connection, key: string, ...fields: string[]) {

		this.checkArgCount('hmget', arguments, 3, -1)

		let r: any[] = []
		r.length = fields.length

		let h: Map<string, any> = this.getDataset(conn.database, key)

		if (h) {
			for (let i = 0; i < fields.length; i++) {
				let value = h.get(fields[i])
				if (value === undefined) {
					r[i] = null
				} else {
					r[i] = value
				}
			}
		} else {
			for (let i = 0; i < fields.length; i++) {
				r[i] = null
			}
		}
		return r
	}

	public hmset(conn: Connection, key: string, field: string, value: string, ...fieldsValues: string[]) {

		this.checkArgCount('hmset', arguments, 4, -1)

		let r = 'OK'
		let h: Map<string, any> = this.getOrCreate(conn.database, key)

		this.hset(conn, key, field, value)

		for (let i = 0; i < fieldsValues.length; i ++) {
			this.hset(conn, key, fieldsValues[i], fieldsValues[i + 1])
			i ++
		}

		return r
	}

	public hgetall(conn: Connection, key: string): any[] {

		this.checkArgCount('hgetall', arguments, 2)

		let h: Map<string, any> = this.getDataset(conn.database, key)
		let r: any[] = [];
		if (h) {
			h.forEach( ( value: any, field: string ) => {
				r.push(field)
				r.push(value)
			})
		}
		return r
	}

	public hexists(conn: Connection, key: string, field: string) {
		this.checkArgCount('hexists', arguments, 3)
		let h: Map<string, any> = this.getDataset(conn.database, key)
		let r = 0;
		if (h && h.has(field)) {
			r = 1
		}
		return r
	}

	public hdel(conn: Connection, key: string, ...fields: string[]) {

		this.checkArgCount('hdel', arguments, 3, -1)

		let h: Map<string, any> = this.getDataset(conn.database, key)
		if (!h) {
			return 0
		}

		let r = 0

		for (let field of fields) {
			if (h.has(field)) {
				h.delete(field)
				r ++
			}
		}
		return r
	}

	public hkeys(conn: Connection, key: string ) {
		this.checkArgCount('hkeys', arguments, 2)
		let h: Map<string, any> = this.getDataset(conn.database, key)
		let r: string[] = []
		if (h) {
			h.forEach( ( value: any, field: string ) => {
				r.push(field)
			})
		}
		return r
	}

	public hlen( conn: Connection, key: string ) {
		this.checkArgCount('hlen', arguments, 2)
		let h: Map<string, any> = this.getDataset(conn.database, key)
		let r = 0
		if (h) {
			r = h.size
		}
		return r
	}

	public hincrby( conn: Connection, key: string, field: string, incr: any ) {
		this.checkArgCount('hincrby', arguments, 4)
		if (!utils.isInt(incr)) {
			throw 'WRONGTYPE incr argument is not integer (' + incr + ')'
		}
		incr = parseInt(incr, 10)

		return this._incr(conn, key, field, incr)
	}

	public hincrbyfloat(conn: Connection, key: string, field: string, incr: any)	{
		this.checkArgCount('hincrbyfloat', arguments, 4)
		if (!utils.isFloat(incr)) {
			throw 'WRONGTYPE incr argument is not float (' + incr + ')'
		}
		incr = parseFloat(incr)
		return this._incr(conn, key, field, incr)
	}

	protected _incr(conn: Connection, key: string, field: string, incr: number)	{
		let h: Map<string, any> = this.getOrCreate(conn.database, key)

		let value = 0
		if (h.has(field)) {
			value = h.get(field)
		}

		value += incr

		h.set(field, value)

		return value
	}

	protected getDataset(db: Database, key: string) {
		let r = db.getDataset(key)
		this.checkType(r, Map)
		return r
	}

	protected createNewKey( db: Database, key: string ) {
		return db.createNewKey( key, new Map<string, any>() )
	}

}

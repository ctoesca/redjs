import {BaseDataManagers} from './BaseDataManagers';
import {Connection} from '../Connection';
import Promise = require('bluebird');

export class Hashes extends BaseDataManagers {

	protected clientsCursors: any = {}
	protected defaultScancount = 10
	protected lastCursorId = 1;

	constructor(opt: any) {
		super(opt);
	}

	public static getCommandsNames(): string[] {
		return ['hget', 'hset', 'HDEL', 'HEXISTS', 'HGETALL', 'HINCRBY', 'HINCRBYFLOAT',
		'HKEYS', 'HLEN', 'HMGET', 'HMSET', 'HSETNX', 'HSTRLEN', 'HVALS', 'HSCAN']
	}

	public hscan(conn: Connection, key: string, cursor: number, ...options: any[]): string	{
		// options:  [MATCH pattern] [COUNT count]

		this.checkMinArgCount('hscan', arguments, 3)

		let argsNames = ['match', 'count']
		let args = {}

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
		let h = this.getDataset(key)
		if (h && (typeof this.data[key][field] !== 'undefined')) {
			r = h[field]
		}
		return r
	}

	public hvals(conn: Connection, key: string) {
		this.checkArgCount('hvals', arguments, 2)

		let h = this.getDataset(key)
		let r = []
		if (h) {
			for (let field in h) {
				if ( typeof h[field] !== 'undefined' ) {
					r.push( h[field] )
				}
			}
		}
		return r
	}

	public hstrlen(conn: Connection, key: string, field: string) {

		this.checkArgCount('hstrlen', arguments, 3)

		let h = this.getDataset(key)

		let r = 0
		if ( h && (typeof h[field] !== 'undefined')) {
			if ( h[field] !== null) {
				r = h[field].length
			}
		}

		return r
	}

	public hset(conn: Connection, key: string, field: string, value: string) {

		this.checkArgCount('hset', arguments, 4)

		let h = this.getOrCreate(key)

		let r = 0
		if (typeof h[field] === 'undefined') {
			r = 1
		}

		h[field] = value

		return r
	}

	public hsetnx(conn: Connection, key: string, field: string, value: string) {

		this.checkArgCount('hsetnx', arguments, 4)

		let h = this.getDataset(key)
		let r = 0
		if (!h) {
			h = this.createNewKey(key)
			r = 1;
		}
		if (typeof h[field] === 'undefined') {
			r = 1
			h[field] = value
		}
		return r
	}

	public hmget(conn: Connection, key: string, ...fields: string[]) {

		this.checkMinArgCount('hmget', arguments, 3)

		let r = []
		let h = this.getDataset(key)
		for (let i = 0; i < fields.length; i ++) {
			if (h) {
				let field = fields[i]
				if (typeof h[field] !== 'undefined') {
					r.push(h[field])
				} else {
					r.push(null)
				}
			} else {
				r.push(null)
			}
		}
		return r
	}

	public hmset(conn: Connection, key: string, field: string, value: string, ...fieldsValues: string[]) {

		this.checkMinArgCount('hmset', arguments, 4)

		let r = 'OK'
		let h = this.getOrCreate(key)

		this.hset(conn, key, field, value)

		for (let i = 0; i < fieldsValues.length; i ++) {
			this.hset(conn, key, fieldsValues[i], fieldsValues[i + 1])
			i ++
		}

		return r
	}

	public hgetall(conn: Connection, key: string) {

		this.checkArgCount('hgetall', arguments, 2)

		let h = this.getDataset(key)
		let r = [];
		if (h) {
			for (let field in h) {
				if (typeof h[field] !== 'undefined') {
					r.push(field)
					r.push(h[field])
				}
			}
		}
		return r
	}

	public hexists(conn: Connection, key: string, field: string) {
		this.checkArgCount('hexists', arguments, 3)
		let h = this.getDataset(key)
		let r = 0;
		if (h && (typeof h[field] !== 'undefined')) {
			r = 1
		}
		return r
	}

	public hdel(conn: Connection, key: string, ...fields: string[]) {

		this.checkMinArgCount('hdel', arguments, 3)

		let h = this.getDataset(key)
		let r = 0
		if (h) {
			for (let i = 0; i < fields.length; i ++) {
				let field = fields[i]
				if (typeof h[field] !== 'undefined') {
					delete h[field]
					r ++
				}
			}
		}
		return r
	}

	public hkeys(conn: Connection, key: string ) {
		this.checkArgCount('hkeys', arguments, 2)
		let h = this.getDataset(key)
		let r: string[] = []
		if (h) {
			r = Object.keys(h)
		}
		return r
	}

	public hlen( conn: Connection, key: string ) {
		this.checkArgCount('hlen', arguments, 2)
		let h = this.getDataset(key)
		let r = 0
		if (h) {
			r = Object.keys(h).length
		}
		return r
	}

	public hincrby( conn: Connection, key: string, field: string, incr: number ) {
		this.checkArgCount('hincrby', arguments, 4)
		if (typeof incr === 'string') {
			incr = parseInt(incr, 10)
		}
		if (typeof incr !== 'number') {
			throw 'WRONGTYPE incr argument is not integer (' + incr + ')'
		}

		return this._incr(conn, key, field, incr)
	}

	public hincrbyfloat(conn: Connection, key: string, field: string, incr: number)	{
		this.checkArgCount('hincrbyfloat', arguments, 4)
		if (typeof incr === 'string') {
			incr = parseFloat(incr)
		}
		if (typeof incr !== 'number') {
			throw 'WRONGTYPE incr argument is not float (' + incr + ')'
		}

		return this._incr(conn, key, field, incr)
	}

	protected _incr(conn: Connection, key: string, field: string, incr: number)	{
		let h = this.getDataset(key)
		if (!h) {
			h = this.createNewKey(key)
		}

		if (typeof h[field] === 'undefined') {
			h[field] = 0
		}

		h[field] += incr
		return h[field]
	}

	protected onTimer() {
	}
}

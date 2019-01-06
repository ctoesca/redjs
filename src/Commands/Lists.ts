import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import * as utils from '../utils';
import {Database} from '../data/Database';
import Promise = require('bluebird');

export class Lists extends AbstractCommands {

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return ['blpop', 'brpop', 'BRPOPLPUSH', 'LINDEX', 'LINSERT', 'LLEN', 'LPOP', 'LPUSH',
		'LPUSH', 'LPUSHX', 'LRANGE', 'LREM', 'LSET', 'LTRIM', 'RPOP', 'RPOPLPUSH', 'RPUSH', 'RPUSHX']
	}

	public lrange(conn: Connection, key: string, start: any, stop: any) {
		this.checkArgCount('lrange', arguments, 4)
		this.checkInt(start)
		this.checkInt(stop)

		let data = this.getDataset(conn.database, key)
		let r: any[] = []

		if (data) {

			let startIndx: number = this.normalizeIndex( start, data )
			let stopIndx: number = this.normalizeIndex( stop, data )

			if ((startIndx >= 0) && (startIndx < data.length) && (startIndx <= stopIndx)) {
				for (let i = startIndx; i <= stopIndx; i++ ) {
					if (i < data.length) {
						r.push( data[i])
					}
				}
			}
		}

		return r
	}

	public lindex(conn: Connection, key: string, index: any) {
		/* https://redis.io/commands/lindex */

		this.checkArgCount('lindex', arguments, 3)
		this.checkInt(index)

		let data = this.getDataset(conn.database, key)
		if (!data) {
			throw key + ' is not a list'
		}

		let r = null
		let indx: number = this.normalizeIndex( index, data )

		if ((indx >= 0) && (indx < data.length)) {
			r = data[indx]
		}

		// pas de out of range error
		return r
	}

	public linsert(conn: Connection, key: string, position: string, pivot: string, value: string) {

		this.checkArgCount('linsert', arguments, 5)

		// LINSERT key BEFORE|AFTER pivot value
		if ((position !== 'BEFORE') && (position !== 'AFTER')) {
			throw 'Invalid argument'
		}

		let r = -1
		let h = this.getDataset(conn.database, key)

		if (h) {
			// !!verifier qu'il s'agit d'une liste
			for (let i = 0; i < h.length; i ++) {
				if (h[i] === pivot) {
					if (position === 'BEFORE') {
						h.splice(i, 0, value)
					} else {
						h.splice(i + 1, 0, value)
					}
					i ++
					r = h.length
				}
			}
		} else {
			r = 0
		}
		return r
	}
	public lset(conn: Connection, key: string, index: any, value: string) {

		this.checkArgCount('lset', arguments, 4)
		this.checkInt(index)

		let r = 'OK'
		let data = this.getDataset(conn.database, key)
		if (!data) {
			throw key + ' is not a list'
		}

		let indx: number = this.normalizeIndex( index, data )

		if ((indx >= 0) && (indx < data.length)) {
			data[indx] = value
		} else {
			throw 'Out of range'
		}

		return r
	}

	public lpush(conn: Connection, key: string, ...values: string[]) {

		this.checkMinArgCount('lpush', arguments, 3)

		let h = this.getOrCreate(conn.database, key)

		for (let v of values) {
			h.splice(0, 0, v);
		}

		return h.length
	}

	public rpush(conn: Connection, key: string, ...values: string[]) {

		this.checkMinArgCount('rpush', arguments, 3)

		let h = this.getOrCreate(conn.database, key)

		for (let v of values) {
			h.push(v);
		}

		return h.length
	}

	public rpop(conn: Connection, key: string) {

		this.checkArgCount('rpop', arguments, 2)

		let h = this.getDataset(conn.database, key)
		let r = null
		if (h && h.length > 0) {
			r = h.pop()
		}

		return r
	}

	public lpop(conn: Connection, key: string) {
		this.checkArgCount('lpop', arguments, 2)
		let h = this.getDataset(conn.database, key)
		let r = null
		if (h && h.length > 0) {
			r = h.shift();
		}

		return r
	}

	public llen(conn: Connection, key: string) {
		this.checkArgCount('llen', arguments, 2)
		let h = this.getDataset(conn.database, key)
		let r = 0
		if (h) {
			r = h.length;
		}
		return r
	}

	protected normalizeIndex( index: any, arr: any[]) {
		let r: number
		index = parseInt(index, 10);
		if (index >= 0) {
			r = index
		} else {
			r = arr.length + index
		}
		return r
	}

	protected getDataset(db: Database, key: string) {
		let r = db.getDataset(key)
		if (r && (typeof r.push === 'undefined')) {
			throw 'WRONGTYPE Operation against a key holding the wrong kind of value'
		}
		return r
	}

	protected createNewKey(db: Database, key: string ) {
		return db.createNewKey( key, [] )
	}

}

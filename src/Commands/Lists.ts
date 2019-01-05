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
		if (!utils.isInt(start)) {
			throw 'ERR value is not an integer or out of range'
		}
		if (!utils.isInt(stop)) {
			throw 'ERR value is not an integer or out of range'
		}

		let data = this.getDataset(conn.database, key)
		let r: any[] = []
		if (data) {
			start = parseInt(start, 10)
			stop = parseInt(stop, 10)

			let startIndx: number
			if (start >= 0) {
				startIndx = start
			} else {
				startIndx = data.length + start
			}

			let stopIndx: number
			if (stop >= 0) {
				stopIndx = stop
			} else {
				stopIndx = data.length + stop
			}

			if (((startIndx >= 0) && (startIndx < data.length)) && (startIndx <= stopIndx)) {
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

		let h = this.getDataset(conn.database, key)
		if (!h) {
			throw key + ' is not a list'
		}
		if (!utils.isInt(index)) {
			throw 'ERR value is not an integer or out of range'
		}

		index = parseInt(index, 10);

		let r = null

		let indx: number
		if (index >= 0) {
			indx = index
		} else {
			indx = h.length + index
		}

		if ((indx >= 0) && (indx < h.length)) {
			r = h[indx]
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

		let r = 'OK'
		let h = this.getDataset(conn.database, key)
		if (!h) {
			throw key + ' is not a list'
		}
		if (!utils.isInt(index)) {
			throw 'ERR value is not an integer or out of range'
		}

		index = parseInt(index, 10);

		let indx: number
		if (index >= 0) {
			indx = index
		} else {
			indx = h.length + index
		}

		if ((indx >= 0) && (indx < h.length)) {
			h[indx] = value
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

	protected onTimer() {

	}

}

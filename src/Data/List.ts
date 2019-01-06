import {BaseDataset} from './BaseDataset';
import {Connection} from '../Connection';
import Promise = require('bluebird');

export class List extends BaseDataset {

	protected data: any[] = []

	constructor(opt: any) {
		super(opt);
	}
/*
	public getCommandsNames(): string[] {
		return ['blpop', 'brpop', 'BRPOPLPUSH', 'LINDEX', 'LINSERT', 'LLEN', 'LPOP', 'LPUSH',
		'LPUSH', 'LPUSHX', 'LRANGE', 'LREM', 'LSET', 'LTRIM', 'RPOP', 'RPOPLPUSH', 'RPUSH', 'RPUSHX']
	}

	public lindex(conn: Connection, index: any) {

		this.checkArgCount('lindex', arguments, 3)

		if (typeof index === 'string') {
			index = parseInt(index, 10)
		}

		let r = null

		let indx: number
		if (index >= 0) {
			indx = index
		} else {
			indx = this.data.length + index
		}

		if ((indx >= 0) && (indx < this.data.length)) {
			r = this.data[indx]
		}

		// pas de out of range error
		return r
	}

	public linsert(conn: Connection, position: string, pivot: string, value: string) {

		this.checkArgCount('linsert', arguments, 5)

		// LINSERT key BEFORE|AFTER pivot value
		if ((position !== 'BEFORE') && (position !== 'AFTER')) {
			throw 'Invalid argument'
		}
		if (arguments.length < 5) {
			throw 'Invalid argument'
		}

		let r = -1

		// !!verifier qu'il s'agit d'une liste
		for (let i = 0; i < this.data.length; i ++) {
			if (this.data[i] === pivot) {
				if (position === 'BEFORE') {
					this.data.splice(i, 0, value)
				} else {
					this.data.splice(i + 1, 0, value)
				}
				i ++
				r = this.data.length
			}
		}

		return r
	}
	public lset(conn: Connection, index: any, value: string) {

		this.checkArgCount('lset', arguments, 4)

		let r = 'OK'

		if (typeof index === 'string') {
			index = parseInt(index, 10)
		}
		let indx: number
		if (index >= 0) {
			indx = index
		} else {
			indx = this.data.length + index
		}

		if ((indx >= 0) && (indx < this.data.length)) {
			this.data[indx] = value
		} else {
			throw 'Out of range'
		}

		return r
	}

	public lpush(conn: Connection, ...values: string[]) {

		this.checkMinArgCount('lpush', arguments, 3)

		for (let v of values) {
			this.data.splice(0, 0, v);
		}

		return this.data.length
	}

	public rpush(conn: Connection, ...values: string[]) {

		this.checkMinArgCount('rpush', arguments, 3)

		for (let v of values) {
			this.data.push(v);
		}

		return this.data.length
	}

	public rpop(conn: Connection) {

		this.checkArgCount('rpop', arguments, 2)

		let r = null
		if (this.data.length > 0) {
			r = this.data.pop()
		}

		return r
	}

	public lpop(conn: Connection) {
		this.checkArgCount('lpop', arguments, 2)

		let r = null
		if (this.data.length > 0) {
			r = this.data.shift();
		}

		return r
	}

	public llen(conn: Connection) {
		this.checkArgCount('llen', arguments, 2)

		let r = this.data.length;

		return r
	}
*/
}

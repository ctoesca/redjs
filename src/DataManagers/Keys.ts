import {BaseDataManagers} from './BaseDataManagers';
import {Connection} from '../Connection';
import Promise = require('bluebird');

export class Keys extends BaseDataManagers {

	constructor(opt: any) {
		super(opt);
	}

	public static getCommandsNames(): string[] {
		return ['get', 'set', 'incr', 'DEL', 'DUMP', 'EXISTS', 'EXPIRE', 'EXPIREAT', 'KEYS', 'MIGRATE', 'MOVE', 'OBJECT', 'PERSISTS',
		'PEXPIRE', 'PEXPIREAT', 'PTTL', 'RANDOMKEY', 'RENAME', 'RENAMENX', 'RESTORE', 'SORT', 'TOUCH', 'TTL', 'TYPE', 'UNLINK', 'WAIT', 'SCAN']
	}

	public get(conn: Connection, key: string) {
		this.checkArgCount('get', arguments, 2)
		let r = null
		if (typeof this.data[key] !== 'undefined') {
			r = this.data[key]
		}

		return r
	}

	public set(conn: Connection, key: string, value: string) {

		this.checkArgCount('set', arguments, 3)

		let r = 0
		if (typeof this.data[key] === 'undefined') {
			r = 1
		}

		this.data[key] = value

		return r
	}

	public incr(conn: Connection, key: string) {

		this.checkArgCount('incr', arguments, 2)

		if (typeof this.data[key] === 'undefined') {
			this.data[key] = 0
		} else {
			if (typeof this.data[key] === 'number') {
				this.data[key] ++;
			} else {
				throw key + ' is not integer'
			}
		}

		let r = this.data[key]

		return r
	}

	protected onTimer() {

	}
}

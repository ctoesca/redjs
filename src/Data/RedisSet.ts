import {BaseDataset} from './BaseDataset';
import {Connection} from '../Connection';
import Promise = require('bluebird');

export class RedisSet extends BaseDataset {

	protected data: Set<any> = new Set()

	constructor(opt: any) {
		super(opt);
	}
/*
	public getCommandsNames(): string[] {
		return ['SADD', 'SCARD', 'SDIFF', 'SDIFFSTORE', 'SINTER', 'SINTERSTORE', 'SISMEMBER', 'SMEMBERS',
		'SMOVE', 'SPOP', 'SRANDMEMBER', 'SREM', 'SUNION', 'SUNIONSTORE', 'SSCAN']
	}

	public srem(conn: Connection, ...members: string[]) {

		this.checkMinArgCount('srem', arguments, 3)

		let r = 0
		for (let i = 0; i < members.length; i ++) {
			let member = members[i]
			if (this.data.delete(member)) {
				r++
			}
		}

		return r
	}

	public sadd(conn: Connection, ...members: string[]) {

		this.checkMinArgCount('sadd', arguments, 3)
		let r = 0
		for (let i = 0; i < members.length; i ++) {
			let member = members[i]
			if (!this.data.has(member)) {
				this.data.add( member )
				r ++
			}
		}
		return r
	}

	public smembers(conn: Connection) {

		this.checkArgCount('smembers', arguments, 2)

		let r = []
		let iterator = this.data.values()
		for (let v of iterator) {
			r.push(v)
		}

		return r
	}*/

}

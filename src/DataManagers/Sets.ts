import {BaseDataManagers} from './BaseDataManagers';
import {Connection} from '../Connection';
import Promise = require('bluebird');

export class Sets extends BaseDataManagers {

	constructor(opt: any) {
		super(opt);
	}

	public static getCommandsNames(): string[] {
		return ['SADD', 'SCARD', 'SDIFF', 'SDIFFSTORE', 'SINTER', 'SINTERSTORE', 'SISMEMBER', 'SMEMBERS',
		'SMOVE', 'SPOP', 'SRANDMEMBER', 'SREM', 'SUNION', 'SUNIONSTORE', 'SSCAN']
	}

	public srem(conn: Connection, key: string, ...members: string[]) {

		this.checkMinArgCount('srem', arguments, 3)

		let set = this.getDataset(key)
		let r = 0
		if (set) {
			for (let i = 0; i < members.length; i ++) {
				let member = members[i]
				if (set.delete(member)) {
					r++
				}
			}
		}
		return r
	}

	public sadd(conn: Connection, key: string, ...members: string[]) {

		this.checkMinArgCount('sadd', arguments, 3)

		let r = 0
		let set = this.getOrCreate(key)
		for (let i = 0; i < members.length; i ++) {
			let member = members[i]
			if (!set.has(member)) {
				set.add( member )
				r ++
			}
		}

		return r
	}

	public smembers(conn: Connection, key: string) {

		this.checkArgCount('smembers', arguments, 2)

		let r = []
		if (typeof this.data[key] !== 'undefined') {
			let iterator = this.data[key].values()
			for (let v of iterator) {
				r.push(v)
			}
		}
		return r
	}

	protected createNewKey( key: string ) {
		this.data[key] = new Set()
		return this.data[key]
	}

	protected onTimer() {

	}

}

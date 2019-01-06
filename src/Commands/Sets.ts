import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import {Database} from '../data/Database';
import * as utils from '../utils';
import Promise = require('bluebird');

export class Sets extends AbstractCommands {

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return ['SADD', 'SCARD', 'SDIFF', 'SDIFFSTORE', 'SINTER', 'SINTERSTORE', 'SISMEMBER', 'SMEMBERS',
		'SMOVE', 'SPOP', 'SRANDMEMBER', 'SREM', 'SUNION', 'SUNIONSTORE', 'SSCAN']
	}

	public srem(conn: Connection, key: string, ...members: string[]) {

		this.checkMinArgCount('srem', arguments, 3)

		let set = this.getDataset(conn.database, key)
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
		let set = this.getOrCreate(conn.database, key)
		for (let member of members) {			
			console.log('add member '+member)
			if (!set.has(member)) {
				set.add( member )
				r ++
			}
		}

		return r
	}

	public smembers(conn: Connection, key: string) {

		this.checkArgCount('smembers', arguments, 2)
		
		let set = this.getDataset(conn.database, key)

		let r = []
		if (set) {
			let iterator = set.values()
			for (let v of iterator) {
				r.push(v)
			}
		}
		return r
	}

	protected getDataset(db: Database, key: string) {
		let r = db.getDataset(key)
		if (r && !(r instanceof Set)) {
			throw 'WRONGTYPE Operation against a key holding the wrong kind of value'
		}
		return r
	}

	protected createNewKey( db: Database, key: string ) {
		return db.createNewKey( key, new Set() )
	}

}

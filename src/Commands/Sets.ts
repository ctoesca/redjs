import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import {Database} from '../data/Database';
import * as utils from '../utils';
import Promise = require('bluebird');
import sha1 = require('sha1');

export class Sets extends AbstractCommands {

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return ['SADD', 'SCARD', 'SDIFF', 'SDIFFSTORE', 'SINTER', 'SINTERSTORE', 'SISMEMBER', 'SMEMBERS',
		'SMOVE', 'SPOP', 'SRANDMEMBER', 'SREM', 'SUNION', 'SUNIONSTORE', 'SSCAN']
	}

	public sismember(conn: Connection, key: string, member: any) {

		this.checkArgCount('srem', arguments, 3, 3)

		let set: Set<any> = this.getDataset(conn.database, key)
		if (!set)
			return 0

		let r = 0
		if (set.has(member)) 
			r = 1 
		return r
	}
	
	public scard(conn: Connection, key: string) {
		this.checkArgCount('sinter', arguments, 2 )
		let set : Set<any> = this.getDataset(conn.database, key)
		let r = 0
		if (set)
			r = set.size
		return r
	}
	
	public sunion(conn: Connection, ...keys: string[]) {

		this.checkArgCount('sinter', arguments, 3, -1)

		let r : any[] = []
		let rTmp: Map<string, any> = new Map<string, any>()

		let sets = this.getDatasets(conn.database, ...keys)

		for (let set of sets) {		
			let iterator = set.values()
			for (let v of iterator) {
				let hash: string = sha1( v ).toString()
				rTmp.set(hash, v )
			}
		}

		rTmp.forEach( ( value: any, field: string ) => {
			r.push( value )
		})

		return r
	}
	public srem(conn: Connection, key: string, ...members: string[]) {

		this.checkArgCount('srem', arguments, 3, -1)

		let set = this.getDataset(conn.database, key)
		let r = 0
		if (!set) 
			return r

		for (let member of members) {
			if (set.delete(member)) {
				r++
			}
		}
		
		return r
	}

	public sadd(conn: Connection, key: string, ...members: string[]) {

		this.checkArgCount('sadd', arguments, 3, -1)

		let r = 0
		let set = this.getOrCreate(conn.database, key)
		if (!set) 
			return r

		for (let member of members) {
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

	public spop(conn: Connection, key: string, count = 1) {

		this.checkArgCount('spop', arguments, 2, 3)
		this.checkInt(count)

		let set = this.getDataset(conn.database, key)
		
		if (!set)
			return null

		if ((count <= 0) || (count > set.size)) {
			throw 'ERR value out of range'
		}
		
		if (set.size === 0) {
			return null;
		}

		let r: any[] = []
		let iterator = set.values()
		let toDelete = []
		for (var i=1; i<=count; i++){
			let member = iterator.next().value
			r.push(member)
			toDelete.push(member)
		}
		
		for (let member of toDelete) {
			set.delete(member)
		}

		return r
	}

	protected getDataset(db: Database, key: string) {
		let r = db.getDataset(key)
		this.checkType(r, Set)
		return r
	}

	protected createNewKey( db: Database, key: string ) {
		return db.createNewKey( key, new Set() )
	}

}

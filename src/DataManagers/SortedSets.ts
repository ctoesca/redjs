import {BaseDataManagers} from './BaseDataManagers';
import {Connection} from '../Connection';
import Promise = require('bluebird');

export class SortedSets extends BaseDataManagers {

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return ['BZPOPMIN', 'BZPOPMAX', 'ZADD', 'ZCARD', 'ZCOUNT', 'ZINCRBY', 'ZINTERSTORE', 'ZLEXCOUNT', 'ZPOPMAX', 'ZPOPMIN', 'ZRANGE',
		'ZRANGEBYLEX', 'ZREVRANGEBYLEX', 'ZRANGEBYSCORE', 'ZRANK', 'ZREM', 'ZREMRANGEBYLEX', 'ZREMRANGEBYRANK', 'ZREMRANGEBYSCORE',
		'ZREVRANGE', 'ZREVRANGEBYSCORE', 'ZREVRANK', 'ZSCORE', 'ZUNIONSTORE', 'ZSCAN']
	}
}

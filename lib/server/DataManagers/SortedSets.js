"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');
const bunyan = require('bunyan');

module.exports = class SortedSets extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);
	
		this.hashes = {

		}
	}

	static getCommandsNames(){
		return ["BZPOPMIN", "BZPOPMAX", "ZADD", "ZCARD", "ZCOUNT", "ZINCRBY", "ZINTERSTORE", "ZLEXCOUNT", "ZPOPMAX", "ZPOPMIN", "ZRANGE", "ZRANGEBYLEX", "ZREVRANGEBYLEX", "ZRANGEBYSCORE", "ZRANK", "ZREM", "ZREMRANGEBYLEX", "ZREMRANGEBYRANK", "ZREMRANGEBYSCORE", "ZREVRANGE", "ZREVRANGEBYSCORE", "ZREVRANK", "ZSCORE", "ZUNIONSTORE", "ZSCAN" ] 
	}
		

}






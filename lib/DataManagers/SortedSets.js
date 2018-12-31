"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');


module.exports = class SortedSets extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

		this.config = opt;

		this.master = opt.master

		this.logger = global.getLogger("SortedSets");			
		this.logger.info("SortedSets created");    
	
		this.hashes = {

		}
	}

	getCommandsNames(){
		return ["BZPOPMIN", "BZPOPMAX", "ZADD", "ZCARD", "ZCOUNT", "ZINCRBY", "ZINTERSTORE", "ZLEXCOUNT", "ZPOPMAX", "ZPOPMIN", "ZRANGE", "ZRANGEBYLEX", "ZREVRANGEBYLEX", "ZRANGEBYSCORE", "ZRANK", "ZREM", "ZREMRANGEBYLEX", "ZREMRANGEBYRANK", "ZREMRANGEBYSCORE", "ZREVRANGE", "ZREVRANGEBYSCORE", "ZREVRANK", "ZSCORE", "ZUNIONSTORE", "ZSCAN" ] 
	}
		

}






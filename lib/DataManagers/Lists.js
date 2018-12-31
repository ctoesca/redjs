"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');

module.exports = class Lists extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

	}

	getCommandsNames(){
		return ["blpop","brpop","BRPOPLPUSH","LINDEX", "LINSERT", "LLEN", "LPOP", "LPUSH", "LPUSH", "LPUSHX", "LRANGE", "LREM", "LSET", "LTRIM", "RPOP", "RPOPLPUSH", "RPUSH", "RPUSHX"]
	}

	hget(fromWorker, hash, key){
		var r = null
		if (this.hashes[hash] && (typeof this.hashes[hash][key] != "undefined"))
			r = this.hashes[hash][key]
		return r
	}

	hset(fromWorker, hash, key, value){		

		if (!this.hashes[hash])
			this.hashes[hash] = {}

		var r = 0
		if (typeof this.hashes[hash][key] == "undefined")
			r = 1

		this.hashes[hash][key] = value

		return r
	}
	
	onTimer(){
		
	}


}





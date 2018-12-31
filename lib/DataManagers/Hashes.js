"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');

module.exports = class Hashes extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

		this.hashes = {

		}
	}

	getCommandsNames(){
		return ["hget","hset","HDEL", "HEXISTS", "HGETALL", "HINCRBY", "HINCRBYFLOAT", "HKEYS", "HLEN", "HMGET", "HMSET", "HSETNX", "HSTRLEN", "HVALS", "HSCAN"]
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





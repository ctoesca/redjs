"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');

module.exports = class Sets extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

		
	}

	getCommandsNames(){
		return ["SADD","SCARD","SDIFF","SDIFFSTORE","SINTER", "SINTERSTORE", "SISMEMBER", "SMEMBERS", "SMOVE", "SPOP", "SRANDMEMBER", "SREM", "SUNION", "SUNIONSTORE", "SSCAN"]
	}

	getNewDataset(){
		return new Set();
	}

	srem(fromWorker, key, ...members){
		var set = this.getDataset(key)
		var r = 0
		if (set)
		{
			for (let i=0; i<members.length; i++)
			{
				var member = members[i]
				if (set.delete(member))
					r++
			}
		}
		return r
	}

	sadd(fromWorker, key, ...members){
		var r = 0
		var set = this.getOrCreate(key)
		for (let i=0; i<members.length; i++){
			var member = members[i]
			if (!set.has(member))
			{
				set.add( member )
				r ++
			}
		}

		return r
	}

	smembers(fromWorker, key){		
		var r = []
		if (typeof this.data[key] != "undefined"){
			var iterator = this.data[key].values()
			for (let v of iterator)
				r.push(v)
		}
		return r
	}
	
	onTimer(){
		
	}


}





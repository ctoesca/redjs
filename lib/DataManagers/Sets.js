"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');
const bunyan = require('bunyan');

module.exports = class Sets extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

		
	}

	static getCommandsNames(){
		return ["SADD","SCARD","SDIFF","SDIFFSTORE","SINTER", "SINTERSTORE", "SISMEMBER", "SMEMBERS", "SMOVE", "SPOP", "SRANDMEMBER", "SREM", "SUNION", "SUNIONSTORE", "SSCAN"]
	}

	getOrCreate(){
		return new Set();
	}

	srem(request, key, ...members){

		
		this.checkMinArgCount("srem", arguments, 3)

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

	sadd(request, key, ...members){

		this.checkMinArgCount("sadd", arguments, 3)

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

	smembers(request, key){	

		this.checkArgCount("smembers", arguments, 2)

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





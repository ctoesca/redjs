"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');
const bunyan = require('bunyan');

module.exports = class Keys extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

	}
	
	static getCommandsNames(){
		return ["get","set","incr", "DEL", "DUMP", "EXISTS", "EXPIRE", "EXPIREAT", "KEYS", "MIGRATE", "MOVE", "OBJECT", "PERSISTS", "PEXPIRE", "PEXPIREAT", "PTTL", "RANDOMKEY", "RENAME", "RENAMENX", "RESTORE", "SORT", "TOUCH", "TTL", "TYPE", "UNLINK", "WAIT", "SCAN"]
	}

	get(request, key)
	{
		var r = null
		if (typeof this.data[key] != "undefined")
			r = this.data[key]

		return r
	}
	
	set(request, key, value){		

		var r = 0
		if (typeof this.data[key] == "undefined")
			r = 1

		this.data[key] = value

		return r
	}
	incr(request, key){

		if (typeof this.data[key] == "undefined"){
			this.data[key] = 0
		}
		else{
			if (typeof this.data[key] == "number")
				this.data[key] ++;
			else
				throw key +" is not integer"
		}

		var r = this.data[key]
		
		return r
	}

	onTimer(){
		
	}


}





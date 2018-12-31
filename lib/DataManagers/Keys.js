"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');

module.exports = class Keys extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

		
		this.keys = {

		}
	}
	
	getCommandsNames(){
		return ["get","set","incr", "DEL", "DUMP", "EXISTS", "EXPIRE", "EXPIREAT", "KEYS", "MIGRATE", "MOVE", "OBJECT", "PERSISTS", "PEXPIRE", "PEXPIREAT", "PTTL", "RANDOMKEY", "RENAME", "RENAMENX", "RESTORE", "SORT", "TOUCH", "TTL", "TYPE", "UNLINK", "WAIT", "SCAN"]
	}

	get(fromWorker, key)
	{
		var r = null
		if (typeof this.keys[key] != "undefined")
			r = this.keys[key]

		return r
	}
	
	set(fromWorker, key, value){		

		var r = 0
		if (typeof this.keys[key] == "undefined")
			r = 1

		this.keys[key] = value

		return r
	}
	incr(fromWorker, key){

		if (typeof this.keys[key] == "undefined"){
			this.keys[key] = 0
		}
		else{
			if (typeof this.keys[key] == "number")
				this.keys[key] ++;
			else
				throw key +" is not integer"
		}

		var r = this.keys[key]
		
		return r
	}

	onTimer(){
		
	}


}





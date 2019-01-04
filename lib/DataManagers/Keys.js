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

	get(conn, key)
	{
		this.checkArgCount("get", arguments, 2)
		var r = null
		if (typeof this.data[key] != "undefined")
			r = this.data[key]

		return r
	}
	
	set(conn, key, value){		

		this.checkArgCount("set", arguments, 3)

		var r = 0
		if (typeof this.data[key] == "undefined")
			r = 1

		this.data[key] = value

		return r
	}
	incr(conn, key){

		this.checkArgCount("incr", arguments, 2)
		
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





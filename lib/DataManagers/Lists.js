"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');
const bunyan = require('bunyan');
module.exports = class Lists extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

	}

	static getCommandsNames(){
		return ["blpop","brpop","BRPOPLPUSH","LINDEX", "LINSERT", "LLEN", "LPOP", "LPUSH", "LPUSH", "LPUSHX", "LRANGE", "LREM", "LSET", "LTRIM", "RPOP", "RPOPLPUSH", "RPUSH", "RPUSHX"]
	}

	createNewKey( key ){
		this.data[key] = []
		return this.data[key]
	}

	lindex(conn, key, index){
		/* https://redis.io/commands/lindex */
		
		this.checkArgCount("lindex", arguments, 3)

		var h = this.getDataset(key)
		if (!h)
			throw key+" is not a list"

		var r = null
		
		index = parseInt(index, 10)

		if (index >=0)
		{
			var indx = index
		}else{
			var indx = h.length + index
		}

		if ((indx >= 0) && (indx < h.length))
			r = h[indx]
		//pas de out of range error
		return r
	}

	linsert(conn, key, position, pivot, value){

		this.checkArgCount("linsert", arguments, 5)

		//LINSERT key BEFORE|AFTER pivot value
		if ((position != 'BEFORE')&& (position != 'AFTER'))
			throw "Invalid argument"
		if (arguments.length < 5)
			throw "Invalid argument"

		var r = -1
		var h = this.getDataset(key)

		if (h)
		{
			//!!verifier qu'il s'agit d'une liste
			for (let i=0; i<h.length; i++)
			{
				if (h[i] == pivot)
				{
					if (position == "BEFORE"){
						h.splice(i, 0, value)

					}else{
						h.splice(i+1, 0, value)
					}
					i++
					r = h.length
				}
			}
		}else{
			r = 0
		}
		return r
	}
	lset(conn, key, index, value){
		
		this.checkArgCount("lset", arguments, 4)

		var r = "OK"
		var h = this.getDataset(key)
		if (!h)
			throw key+" is not a list"

		index = parseInt(index, 10)
		if (index >=0)
		{
			var indx = index
		}else{
			var indx = h.length + index
		}

		if ((indx >= 0) && (indx < h.length))
			h[indx] = value
		else
			throw "Out of range"
						
		return r
	}

	lpush(conn, key, ...values){

		this.checkMinArgCount("lpush", arguments, 3)

		var h = this.getOrCreate(key)

		for (let v of values)
			h.splice(0, 0, v);
				
		return h.length
	}

	rpush(conn, key, ...values){

		this.checkMinArgCount("rpush", arguments, 3)

		var h = this.getOrCreate(key)

		for (let v of values)
			h.push(v);
				
		return h.length
	}

	rpop(conn, key){

		this.checkArgCount("rpop", arguments, 2)

		var h = this.getDataset(key)
		var r = null
		if (h && h.length > 0)
			r = h.pop()
				
		return r
	}

	lpop(conn, key){
		this.checkArgCount("lpop", arguments, 2)
		var h = this.getDataset(key)
		var r = null
		if (h && h.length > 0)
			r = h.shift();
					
		return r
	}

	llen(conn, key){
		this.checkArgCount("llen", arguments, 2)
		var h = this.getDataset(key)
		var r = 0
		if (h)
			r = h.length;		
		return r
	}

	onTimer(){
		
	}


}





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

	lindex(request, key, index){
		var h = this.getDataset(key)
		if (!h)
			throw key+" is not a list"

		var r = null
		if (index >=0)
		{
			var indx = index
		}else{
			var indx = h.length + index
		}
		if ((indx >= 0) && (indx < h.length))
			r = h[indx]
		
		return r
	}

	linsert(request, key, position, pivot, value){
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
		}
		return r
	}
	lset(request, key, index, value){
		
		var r = "OK"
		var h = this.getDataset(key)
		if (!h)
			throw key+" is not a list"

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

	lpush(request, key, ...values){
		var h = this.getOrCreate(key)

		for (let v of values)
			h.splice(0, 0, v);
				
		return h.length
	}

	rpush(request, key, ...values){
		var h = this.getOrCreate(key)

		for (let v of values)
			h.push(v);
				
		return h.length
	}

	rpop(request, key){
		var h = this.getDataset(key)
		var r = null
		if (h)
			r = h.pop()
				
		return r
	}

	lpop(request, key){
		var h = this.getDataset(key)
		var r = null
		if (h)
			r = h.shift();
					
		return r
	}

	llen(request, key){
		var h = this.getDataset(key)
		var r = 0
		if (h)
			r = h.length;		
		return r
	}

	onTimer(){
		
	}


}





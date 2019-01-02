"use strict";

const Promise = require('bluebird');
const BaseDataManagers = require('./BaseDataManagers');
const bunyan = require('bunyan');

module.exports = class Hashes extends BaseDataManagers {
	   
	constructor(opt){ 

		super(opt);

		this.clientsCursors = {}
		this.defaultScancount = 10;
		this.lastCursorId = 1;
	}

	static getCommandsNames(){
		return ["hget","hset","HDEL", "HEXISTS", "HGETALL", "HINCRBY", "HINCRBYFLOAT", "HKEYS", "HLEN", "HMGET", "HMSET", "HSETNX", "HSTRLEN", "HVALS", "HSCAN"]
	}

	hscan(request, key, cursor, ...options)
	{
		// options:  [MATCH pattern] [COUNT count]
		
		
		var argsNames = ['match', 'count']
		var args = {}

		try{
			if (options.length > argsNames.length*2)
				throw "Too many arguments"
			if (options.length % 2 != 0) 
				throw "Invalid arguments count"
			
			for (var i=0; i<options.length; i++ )
			{
				var opt = options[i]

				if (typeof opt == "string")
					opt = opt.toLowerCase()

				if (argsNames.indexOf(opt) >= 0)
				{
					if (typeof args[opt] != "undefined")
						throw "Argument '"+opt+"' defined twice"

					args[opt] = options[i+1]
				}else{
					throw "unknown argument: '"+opt+"'"
				}

				i++
			}

		}catch(err){
			var invalidArgumentsError = new Error("Invalid arguments: "+err.toString()+". Syntax: hscan key cursor [MATCH pattern] [COUNT count]")
			throw invalidArgumentsError
		}

		if (cursor == 0)
		{
			this.lastCursorId ++

			var cursorObject = {
				id: this.lastCursorId,
				poisition: 0
			}
			if (!this.clientsCursors[request.clientId])
				this.clientsCursors[request.clientId] = {}

			this.clientsCursors[request.clientId][cursorObject.id] = cursorObject

		}else
		{
			if (!this.clientsCursors[request.clientId] || !this.clientsCursors[request.clientId][cursor])
				throw "Cursor '"+cursor+"' does not exit"

			var cursorObject = this.clientsCursors[request.clientId][cursor]
		}
		
		console.log("key="+key+", cursor="+cursor+", options=", args, "cursorObject=", cursorObject)
		throw "Not yet implemented"

		return "OK"
	}

	hget(request, key, field){
		
		var r = null
		var h = this.getDataset(key)
		if (h && (typeof this.data[key][field] != "undefined"))
			r = h[field]
		return r
	}
	
	hvals(request, key){
		var h = this.getDataset(key)
		var r = []
		if (h){
			for (let field in h){
				r.push(h[field])
			}
		}
		return r
	}

	hstrlen(request, key, field){		

		var h = this.getDataset(key)

		var r = 0
		if ( h && (typeof h[field] != "undefined")){
			if ( h[field] != null)
				r = h[field].length
		}

		return r
	}

	hset(request, key, field, value){		

		var h = this.getOrCreate(key)

		var r = 0
		if (typeof h[field] == "undefined")
			r = 1

		h[field] = value

		return r
	}

	hsetnx(request, key, field, value){
		var h = this.getDataset(key)
		var r = 0
		if (!h){
			h = this.createNewKey(key)
			r = 1;
		}
		if (typeof h[field] == "undefined"){
			r = 1
			h[field] = value
		}
		return r
	}

	hmget(request, key, ...fields){
		var r = []
		var h = this.getDataset(key)
		for (let i=0; i<fields.length; i++){
			if (h){
				var field = fields[i]
				if (typeof h[field] != "undefined")
					r.push(h[field])
				else
					r.push(null)
			}else{
				r.push(null)
			}
		}
		return r
	}

	hmset(request, key, field, value, ...fieldsValues){

		var r = "OK"
		var h = this.getOrCreate(key)

		this.hset(request, key, field, value)

		for (let i=0; i<fieldsValues.length; i++){
			var field = fieldsValues[i]
			var value = fieldsValues[i+1]
			i++
			this.hset(request, key, field, value)
		}

		return r
	}

	hgetall(request, key){		
		var h = this.getDataset(key)
		var r = [];
		if (h){			
			for (let field in h){
				r.push(field)
				r.push(h[field])
			}
		}
		return r
	}

	hexists(request, key, field){		
		var h = this.getDataset(key)
		var r = 0;
		if (h && (typeof h[field] != "undefined"))
			r = 1
		return r
	}

	hdel(request, key, ...fields){		

		var h = this.getDataset(key)
		var r = 0
		if (h){
			for (let i=0; i<fields.length; i++){
				var field = fields[i]
				if (typeof h[field] != "undefined"){
					delete h[field]
					r ++
				}
			}
		}
		return r
	}

	hkeys( request, key ){
		var h = this.getDataset(key)
		var r = []
		if (h){
			for (let field in h)
				r.push(field)
		}
		return r
	}

	hlen( request, key ){
		var h = this.getDataset(key)
		var r = 0
		if (h){
			for (let field in h)
				r++
		}
		return r
	}

	hincrby( request, key, field, incr )
	{
		if (typeof incr == "string")
			incr = parseInt(incr)
		if (typeof incr != "number")
			throw "incr argument is not integer ("+incr+")"
		
		return this._incr(key, field, incr)
	}
	
	hincrbyfloat(request, key, field, incr)
	{
		if (typeof incr == "string")
			incr = parseFloat(incr)
		if (typeof incr != "number")
			throw "incr argument is not float ("+incr+")"
		return this._incr(key, field, incr)
	}

	_incr(key, field, incr)
	{
		var h = this.getDataset(key)
		if (!h)
			h = this.createNewKey(key)
			
		if (typeof h[field] == "undefined")
			h[field] = 0

		h[field] += incr
		return h[field]
	}
	onTimer(){
		
	}


}





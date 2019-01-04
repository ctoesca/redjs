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

	hscan(conn, key, cursor, ...options)
	{
		// options:  [MATCH pattern] [COUNT count]
		
		this.checkMinArgCount("hscan", arguments, 3)

		var argsNames = ['match', 'count']
		var args = {}

		try{
			if (options.length > argsNames.length*2)
				throw "ERR Too many arguments"
			if (options.length % 2 != 0) 
				throw "ERR Invalid arguments count"
			
			for (var i=0; i<options.length; i++ )
			{
				var opt = options[i]

				if (typeof opt == "string")
					opt = opt.toLowerCase()

				if (argsNames.indexOf(opt) >= 0)
				{
					if (typeof args[opt] != "undefined")
						throw "ERR Argument '"+opt+"' defined twice"

					args[opt] = options[i+1]
				}else{
					throw "ERR unknown argument: '"+opt+"'"
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
			if (!this.clientsCursors[conn.id])
				this.clientsCursors[conn.id] = {}

			this.clientsCursors[conn.id][cursorObject.id] = cursorObject

		}else
		{
			if (!this.clientsCursors[conn.id] || !this.clientsCursors[conn.id][cursor])
				throw "Cursor '"+cursor+"' does not exit"

			var cursorObject = this.clientsCursors[conn.id][cursor]
		}
		
		console.log("key="+key+", cursor="+cursor+", options=", args, "cursorObject=", cursorObject)
		throw "ERR Not yet implemented"

		return "OK"
	}

	hget(conn, key, field){
		
		this.checkArgCount("hget", arguments, 3)

		var r = null
		var h = this.getDataset(key)
		if (h && (typeof this.data[key][field] != "undefined"))
			r = h[field]
		return r
	}
	
	hvals(conn, key){
		this.checkArgCount("hvals", arguments, 2)

		var h = this.getDataset(key)
		var r = []
		if (h){
			for (let field in h){
				r.push(h[field])
			}
		}
		return r
	}

	hstrlen(conn, key, field){		
		
		this.checkArgCount("hstrlen", arguments, 3)

		var h = this.getDataset(key)

		var r = 0
		if ( h && (typeof h[field] != "undefined")){
			if ( h[field] != null)
				r = h[field].length
		}

		return r
	}

	hset(conn, key, field, value){		

		this.checkArgCount("hset", arguments, 4)

		var h = this.getOrCreate(key)

		var r = 0
		if (typeof h[field] == "undefined")
			r = 1

		h[field] = value

		return r
	}

	hsetnx(conn, key, field, value){
		
		this.checkArgCount("hsetnx", arguments, 4)

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

	hmget(conn, key, ...fields){

		this.checkMinArgCount("hmget", arguments, 3)

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

	hmset(conn, key, field, value, ...fieldsValues){

		this.checkMinArgCount("hmset", arguments, 4)

		var r = "OK"
		var h = this.getOrCreate(key)

		this.hset(conn, key, field, value)

		for (let i=0; i<fieldsValues.length; i++){
			var field = fieldsValues[i]
			var value = fieldsValues[i+1]
			i++
			this.hset(conn, key, field, value)
		}

		return r
	}

	hgetall(conn, key){	

		this.checkArgCount("hgetall", arguments, 2)		

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

	hexists(conn, key, field){		
		this.checkArgCount("hexists", arguments, 3)
		var h = this.getDataset(key)
		var r = 0;
		if (h && (typeof h[field] != "undefined"))
			r = 1
		return r
	}

	hdel(conn, key, ...fields){		
		
		this.checkMinArgCount("hdel", arguments, 3)

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

	hkeys( conn, key ){
		this.checkArgCount("hkeys", arguments, 2)
		var h = this.getDataset(key)
		var r = []
		if (h){
			for (let field in h)
				r.push(field)
		}
		return r
	}

	hlen( conn, key ){
		this.checkArgCount("hlen", arguments, 2)
		var h = this.getDataset(key)
		var r = 0
		if (h){
			for (let field in h)
				r++
		}
		return r
	}

	hincrby( conn, key, field, incr )
	{
		this.checkArgCount("hincrby", arguments, 4)
		if (typeof incr == "string")
			incr = parseInt(incr)
		if (typeof incr != "number")
			throw "WRONGTYPE incr argument is not integer ("+incr+")"
		incr = parseInt(incr, 10)
		return this._incr(key, field, incr)
	}
	
	hincrbyfloat(conn, key, field, incr)
	{
		this.checkArgCount("hincrbyfloat", arguments, 4)
		if (typeof incr == "string")
			incr = parseFloat(incr)
		if (typeof incr != "number")
			throw "WRONGTYPE incr argument is not float ("+incr+")"
		incr = parseFloat(incr, 10)
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





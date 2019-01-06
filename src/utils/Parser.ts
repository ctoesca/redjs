import Promise = require('bluebird');
import EventEmitter = require('events');
const RedisParser = require('redis-parser');
import * as utils from '../utils';

export class Parser extends EventEmitter {

	constructor() {
		super();
	}

	/*
		For Simple Strings the first byte of the reply is "+"
		For Errors the first byte of the reply is "-"
		For Integers the first byte of the reply is ":"
		For Bulk Strings the first byte of the reply is "$"
		For Arrays the first byte of the reply is "*"
	*/
	public fromRESP( data: any ) {
		// '*2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n'
		let results: any[] = []
		let errors: any[] = []

		this.execRedisParser( data , results, errors)

		if (errors.length > 0) {
			if (errors.length === 1) {
				throw errors[0]
			} else {
				throw errors
			}
		} else {
			if (results.length === 1) {
				return results[0]
			} else {
				return results
			}
		}
	}

	public toRESP( data: any, type: string = null): any {
		/*
		type: simpleString | error | integer | bulkString | array
		*/

		let r = null;
		if (typeof data === 'string') {
			r = this.stringToResp(data, type)
		} else if (data === null) {
			r = '$-1\r\n'
		} else if (utils.isInt(data)) {
			// INTEGER
			r = ':' + data + '\r\n'
		} else if (typeof data === 'object') {
			r = this.objectToResp(data)
		} else if (typeof data === 'number') {
			// FLOAT -> bulkString
			r = '$' + data.toString().length + '\r\n' + data + '\r\n'
		} else {
			throw ('ERR Unknown response type for response \'' + data + '\'')
		}
		return r
	}

	protected stringToResp(data: any, forcedType = 'null') {
		let r = null
		if (!forcedType) {
			forcedType = 'bulkString'
		}
		// '$6\r\nfoobar\r\n'
		if (forcedType === 'simpleString') {
			r = '+' + data + '\r\n'
		} else if (forcedType === 'error') {
			r = '-' + data + '\r\n'
		} else {
			r = '$' + data.length + '\r\n' + data + '\r\n'
		}
		return r
	}

	protected objectToResp(data: any) {
		let r = null
		if (typeof data.push === 'function') {
			// ARRAY
			// *2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n
			r = '*' + data.length + '\r\n'
			for (let value of data) {
				r += this.toRESP(value)
			}
		} else if (typeof data.value !== 'undefined') {
			/* object {
				value: '...',
				type: 'simpleString'
			}*/
			r = this.toRESP(data.value, data.type)
		} else {
			throw ('ERR Unknown response type for response \'' + data + '\'')
		}
		return r
	}

	protected execRedisParser(data: any, results: any, errors: any) {
		let parser = new RedisParser({
			returnReply: (reply: any) => {
				results.push(reply)
			},
			returnError: (err: any) => {
				errors.push(err)
			},
			returnFatalError: (err: any) => {
				errors.push(err)
			},
			name: 'javascript'
		});
		parser.execute(data)

	}
}



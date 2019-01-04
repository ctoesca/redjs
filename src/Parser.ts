import Promise = require('bluebird');
import EventEmitter = require('events');
const RedisParser = require('redis-parser');
import * as utils from './utils';

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

	public toRESP( resp: any, type: string = null) {
		/*
		type: simpleString | error | integer | bulkString | array
		*/

		let r = null;
		if (typeof resp === 'string') {
			if (!type) {
				type = 'bulkString'
			}

			// '$6\r\nfoobar\r\n'
			if (type === 'simpleString') {
				r = '+' + resp + '\r\n'
			} else if (type === 'error') {
				r = '-' + resp + '\r\n'
			} else {
				r = '$' + resp.length + '\r\n' + resp + '\r\n'
			}

		} else if (resp === null) {
			r = '$-1\r\n'
		} else if (utils.isInt(resp)) {
			// INTEGER
			r = ':' + resp + '\r\n'
		} else if ((typeof resp === 'object') && (typeof resp.push === 'function')) {
			// ARRAY
			// *2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n
			r = '*' + resp.length + '\r\n'
			for (let value of resp) {
				r += this.toRESP(value)
			}
		} else {
			throw ('ERR Unknown response type for response \'' + resp + '\'')
		}
		return r
	}

}



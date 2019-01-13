import urlParser = require('url')
import _ = require('lodash')
import { Timer} from './Timer'

function randomBetween(min: number, max: number) {
	return Math.floor(Math.random() * max) + min;
}

function parseURL(url: any) {
	if (isInt(url)) {
		return { port: url }
	}
	let parsed = urlParser.parse(url, true, true)

	if (!parsed.slashes && url[0] !== '/') {
		url = '//' + url
		parsed = urlParser.parse(url, true, true)
	}

	let result: any = {}
	if (parsed.auth) {
		result.password = parsed.auth.split(':')[1]
	}
	if (parsed.pathname) {
		if (parsed.protocol === 'redis:') {
			if (parsed.pathname.length > 1) {
				result.db = parsed.pathname.slice(1)
			}
		} else {
			result.path = parsed.pathname
		}
	}
	if (parsed.host) {
		result.host = parsed.hostname
	}
	if (parsed.port) {
		result.port = parsed.port
	}

	_.defaults(result, parsed.query)

	return result
}

/**
 * Detect the argument is a int
 *
 * @param {string} value
 * @return {boolean} Whether the value is a int
 * @example
 * ```js
 * > isInt('123')
 * true
 * > isInt('123.3')
 * false
 * > isInt('1x')
 * false
 * > isInt(123)
 * true
 * > isInt(true)
 * false
 * ```
 * @private
 */
	function isInt(value: any) {
		let x = parseFloat(value)
		return !isNaN(value) && (x | 0) === x
	}

	/*function isInt(n){
    	return Number(n) === n && n % 1 === 0;
	}*/
	function isFloat(n: any) {
		let x = parseFloat(n)
		return !isNaN(x) ;
	}


export { isInt, isFloat, parseURL, Timer, randomBetween};

 const urllibParse = require('url').parse
const defaults = require('lodash').defaults

 var parseURL = function(url) {
  if (isInt(url)) {
    return { port: url }
  }
  var parsed = urllibParse(url, true, true)

  if (!parsed.slashes && url[0] !== '/') {
    url = '//' + url
    parsed = urllibParse(url, true, true)
  }

  var result = {}
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
  defaults(result, parsed.query)

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
var isInt = function(value) {
  var x = parseFloat(value)
  return !isNaN(value) && (x | 0) === x
}

exports.parseURL = parseURL
exports.isInt = isInt
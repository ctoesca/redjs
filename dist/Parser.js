"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const RedisParser = require('redis-parser');
const utils = require("./utils");
class Parser extends EventEmitter {
    constructor() {
        super();
    }
    fromRESP(data) {
        let results = [];
        let errors = [];
        let parser = new RedisParser({
            returnReply: (reply) => {
                results.push(reply);
            },
            returnError: (err) => {
                errors.push(err);
            },
            returnFatalError: (err) => {
                errors.push(err);
            },
            name: 'javascript'
        });
        parser.execute(data);
        if (errors.length > 0) {
            if (errors.length === 1) {
                throw errors[0];
            }
            else {
                throw errors;
            }
        }
        else {
            if (results.length === 1) {
                return results[0];
            }
            else {
                return results;
            }
        }
    }
    toRESP(resp, type = null) {
        let r = null;
        if (typeof resp === 'string') {
            if (!type) {
                type = 'bulkString';
            }
            if (type === 'simpleString') {
                r = '+' + resp + '\r\n';
            }
            else if (type === 'error') {
                r = '-' + resp + '\r\n';
            }
            else {
                r = '$' + resp.length + '\r\n' + resp + '\r\n';
            }
        }
        else if (resp === null) {
            r = '$-1\r\n';
        }
        else if (utils.isInt(resp)) {
            r = ':' + resp + '\r\n';
        }
        else if ((typeof resp === 'object') && (typeof resp.push === 'function')) {
            r = '*' + resp.length + '\r\n';
            for (let value of resp) {
                r += this.toRESP(value);
            }
        }
        else if (typeof resp === 'number') {
            r = '$' + resp.toString().length + '\r\n' + resp + '\r\n';
        }
        else {
            throw ('ERR Unknown response type for response \'' + resp + '\'');
        }
        return r;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map
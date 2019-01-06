"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const RedisParser = require('redis-parser');
const utils = require("../utils");
class Parser extends EventEmitter {
    constructor() {
        super();
    }
    fromRESP(data) {
        let results = [];
        let errors = [];
        this.execRedisParser(data, results, errors);
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
    toRESP(data, type = null) {
        let r = null;
        if (typeof data === 'string') {
            r = this.stringToResp(data, type);
        }
        else if (data === null) {
            r = '$-1\r\n';
        }
        else if (utils.isInt(data)) {
            r = ':' + data + '\r\n';
        }
        else if (typeof data === 'object') {
            r = this.objectToResp(data);
        }
        else if (typeof data === 'number') {
            r = '$' + data.toString().length + '\r\n' + data + '\r\n';
        }
        else {
            throw ('ERR Unknown response type for response \'' + data + '\'');
        }
        return r;
    }
    stringToResp(data, forcedType = 'null') {
        let r = null;
        if (!forcedType) {
            forcedType = 'bulkString';
        }
        if (forcedType === 'simpleString') {
            r = '+' + data + '\r\n';
        }
        else if (forcedType === 'error') {
            r = '-' + data + '\r\n';
        }
        else {
            r = '$' + data.length + '\r\n' + data + '\r\n';
        }
        return r;
    }
    objectToResp(data) {
        let r = null;
        if (typeof data.push === 'function') {
            r = '*' + data.length + '\r\n';
            for (let value of data) {
                r += this.toRESP(value);
            }
        }
        else if (typeof data.value !== 'undefined') {
            r = this.toRESP(data.value, data.type);
        }
        else {
            throw ('ERR Unknown response type for response \'' + data + '\'');
        }
        return r;
    }
    execRedisParser(data, results, errors) {
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
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map
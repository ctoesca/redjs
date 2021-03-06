"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const EventEmitter = require("events");
const RedisParser = require('redis-parser');
const utils = require("../utils");
const RedisError_1 = require("../Errors/RedisError");
class Parser extends EventEmitter {
    constructor() {
        super();
    }
    fromRESP(data) {
        let errors = [];
        let results = [];
        this.execRedisParser(data, results, errors);
        if (errors.length > 0) {
            throw errors;
        }
        else if (results.length === 1) {
            return results[0];
        }
        else {
            return results;
        }
    }
    toRESP(data, type = null) {
        let r = null;
        if (typeof data === 'string') {
            r = this.stringToResp(data, type);
        }
        else if (data === null) {
            if (type === 'array') {
                r = '*-1\r\n';
            }
            else {
                r = '$-1\r\n';
            }
        }
        else if (typeof data === 'object') {
            r = this.objectToResp(data, type);
        }
        else if (typeof data === 'number') {
            r = this.numberToResp(data, type);
        }
        else {
            throw new RedisError_1.RedisError('ERR Unknown response type for response \'' + data + '\'');
        }
        return r;
    }
    numberToResp(data, forcedType = null) {
        let r = null;
        if (utils.isInt(data)) {
            r = ':' + data + '\r\n';
        }
        else {
            r = '$' + data.toString().length + '\r\n' + data + '\r\n';
        }
        return r;
    }
    stringToResp(data, forcedType = null) {
        let r = null;
        if (!forcedType) {
            if (data === 'OK') {
                forcedType = 'simpleString';
            }
            else {
                forcedType = 'bulkString';
            }
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
    arrayToResp(data, forcedType = null) {
        let r;
        if (data === null) {
            r = '*-1\r\n';
        }
        else {
            r = '*' + data.length + '\r\n';
            for (let value of data) {
                r += this.toRESP(value);
            }
        }
        return r;
    }
    objectToResp(data, forcedType = null) {
        let r = null;
        if (data instanceof Error) {
            r = '-' + data.toString() + '\r\n';
        }
        else if ((typeof data.push === 'function') || (forcedType === 'array')) {
            r = this.arrayToResp(data);
        }
        else if (typeof data.value !== 'undefined') {
            r = this.toRESP(data.value, data.type);
        }
        else {
            throw new RedisError_1.RedisError('ERR Unknown response type for response \'' + data + '\'');
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
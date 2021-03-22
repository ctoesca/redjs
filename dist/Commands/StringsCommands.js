"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringsCommands = void 0;
const AbstractCommands_1 = require("./AbstractCommands");
const utils = require("../utils");
const StringsDataset_1 = require("../Data/StringsDataset");
const RedisError_1 = require("../Errors/RedisError");
const NotImplementedError_1 = require("../Errors/NotImplementedError");
class StringsCommands extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return [
            'get',
            'strlen',
            'set',
            'incr'
        ];
    }
    getNotImplementedCommands() {
        return [
            'append',
            'bitcount',
            'bitfield',
            'bitop',
            'bitpos',
            'decr',
            'decrby',
            'getbit',
            'getdel',
            'getex',
            'getrange',
            'getset',
            'incrby',
            'incrbyfloat',
            'mget',
            'mset',
            'msetnx',
            'psetex',
            'setbit',
            'setex',
            'setnx',
            'setrange',
            'stralgo'
        ];
    }
    check_strlen(conn, key) {
        this.checkArgCount('strlen', arguments, 2);
    }
    strlen(conn, key) {
        let data = this.getDataset(conn.database, key);
        if (!data) {
            return 0;
        }
        let r = 0;
        if (typeof data.value !== 'string') {
            throw new RedisError_1.RedisError('ERR value is not a string or out of range');
        }
        r = data.value.length;
        return r;
    }
    check_get(conn, key) {
        this.checkArgCount('get', arguments, 2);
    }
    get(conn, key) {
        let r = null;
        let data = this.getDataset(conn.database, key);
        if (data) {
            r = data.value;
        }
        return r;
    }
    check_set(conn, key, value, ...options) {
        this.checkArgCount('set', arguments, 3, -1);
    }
    set(conn, key, value, ...options) {
        if (options.length > 0) {
            throw new NotImplementedError_1.NotImplementedError('set with options');
        }
        let data = this.getOrCreate(conn.database, key);
        data.value = value;
        return 'OK';
    }
    check_incr(conn, key) {
        this.checkArgCount('incr', arguments, 2);
    }
    incr(conn, key) {
        let data = this.getDataset(conn.database, key);
        if (data) {
            if (!utils.isInt(data.value)) {
                throw new RedisError_1.RedisError('ERR value is not an integer or out of range');
            }
        }
        else {
            data = this.createNewKey(conn.database, key);
            data.value = 0;
        }
        data.value++;
        return data.value;
    }
    getDataset(db, key) {
        let r = db.getDataset(key);
        this.checkType(r, StringsDataset_1.StringsDataset);
        return r;
    }
    createNewKey(db, key) {
        return db.createStringsDataset(key);
    }
}
exports.StringsCommands = StringsCommands;
//# sourceMappingURL=StringsCommands.js.map
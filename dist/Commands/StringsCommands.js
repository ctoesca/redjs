"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommands_1 = require("./AbstractCommands");
const utils = require("../utils");
class StringsCommands extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['APPEND', 'BITCOUNT', 'BITFIELD', 'BITOP', 'BITPOS', 'DECR', 'DECRBY', 'GET', 'GETBIT', 'GETRANGE',
            'GETSET', 'INCR', 'INCRBY', 'INCRBYFLOAT', 'MGET', 'MSET', 'MSETNX', 'PSETEX', 'SET', 'SETBIT', 'SETEX', 'SETNX', 'SETRANGE', 'STRLEN'];
    }
    get(conn, key) {
        this.checkArgCount('get', arguments, 2);
        let r = null;
        let data = this.getDataset(conn.database, key);
        if (data) {
            r = data.value;
        }
        return r;
    }
    set(conn, key, value, ...options) {
        this.checkMinArgCount('set', arguments, 3);
        let r = 'OK';
        let data = this.getOrCreate(conn.database, key);
        data.value = value;
        return r;
    }
    incr(conn, key) {
        this.checkArgCount('exists', arguments, 2);
        let data = this.getDataset(conn.database, key);
        if (data) {
            if (!utils.isInt(data.value)) {
                throw 'ERR value is not an integer or out of range';
            }
        }
        else {
            data = this.createNewKey(conn.database, key);
            data.value = 0;
        }
        data.value++;
        return data.value;
    }
    createNewKey(db, key) {
        return db.createNewKey(key, { value: '' });
    }
    onTimer() {
    }
}
exports.StringsCommands = StringsCommands;
//# sourceMappingURL=StringsCommands.js.map
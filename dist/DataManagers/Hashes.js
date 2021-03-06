"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDataManagers_1 = require("./BaseDataManagers");
class Hashes extends BaseDataManagers_1.BaseDataManagers {
    constructor(opt) {
        super(opt);
        this.clientsCursors = {};
        this.defaultScancount = 10;
        this.lastCursorId = 1;
    }
    getCommandsNames() {
        return ['hget', 'hset', 'HDEL', 'HEXISTS', 'HGETALL', 'HINCRBY', 'HINCRBYFLOAT',
            'HKEYS', 'HLEN', 'HMGET', 'HMSET', 'HSETNX', 'HSTRLEN', 'HVALS', 'HSCAN'];
    }
    hscan(conn, key, cursor, ...options) {
        this.checkMinArgCount('hscan', arguments, 3);
        let argsNames = ['match', 'count'];
        let args = {};
        try {
            if (options.length > argsNames.length * 2) {
                throw 'ERR Too many arguments';
            }
            if (options.length % 2 !== 0) {
                throw 'ERR Invalid arguments count';
            }
            for (let i = 0; i < options.length; i++) {
                let opt = options[i];
                if (typeof opt === 'string') {
                    opt = opt.toLowerCase();
                }
                if (argsNames.indexOf(opt) >= 0) {
                    if (typeof args[opt] !== 'undefined') {
                        throw 'ERR Argument \'' + opt + '\' defined twice';
                    }
                    args[opt] = options[i + 1];
                }
                else {
                    throw 'ERR unknown argument: \'' + opt + '\'';
                }
                i++;
            }
        }
        catch (err) {
            let invalidArgumentsError = new Error('Invalid arguments: ' + err.toString() + '. Syntax: hscan key cursor [MATCH pattern] [COUNT count]');
            throw invalidArgumentsError;
        }
        let cursorObject;
        if (cursor === 0) {
            this.lastCursorId++;
            cursorObject = {
                id: this.lastCursorId,
                position: 0
            };
            if (!this.clientsCursors[conn.id]) {
                this.clientsCursors[conn.id] = {};
            }
            this.clientsCursors[conn.id][cursorObject.id] = cursorObject;
        }
        else {
            if (!this.clientsCursors[conn.id] || !this.clientsCursors[conn.id][cursor]) {
                throw 'Cursor \'' + cursor + '\' does not exit';
            }
            cursorObject = this.clientsCursors[conn.id][cursor];
        }
        console.log('key=' + key + ', cursor=' + cursor + ', options=', args, 'cursorObject=', cursorObject);
        throw 'ERR Not yet implemented';
    }
    hget(conn, key, field) {
        this.checkArgCount('hget', arguments, 3);
        let r = null;
        let h = this.getDataset(key);
        if (h && h.has(field)) {
            r = h.get(field);
        }
        return r;
    }
    hvals(conn, key) {
        this.checkArgCount('hvals', arguments, 2);
        let h = this.getDataset(key);
        let r = [];
        if (h) {
            h.forEach((value, field) => {
                r.push(value);
            });
        }
        return r;
    }
    hstrlen(conn, key, field) {
        this.checkArgCount('hstrlen', arguments, 3);
        let h = this.getDataset(key);
        let r = 0;
        if (h && h.has(field)) {
            let value = h.get(field);
            if (value !== null) {
                r = value.toString().length;
            }
        }
        return r;
    }
    hset(conn, key, field, value) {
        this.checkArgCount('hset', arguments, 4);
        let h = this.getOrCreate(key);
        let r = 0;
        if (!h.has(field)) {
            r = 1;
        }
        h.set(field, value);
        return r;
    }
    hsetnx(conn, key, field, value) {
        this.checkArgCount('hsetnx', arguments, 4);
        let h = this.getDataset(key);
        let r = 0;
        if (!h) {
            h = this.createNewKey(key);
            r = 1;
        }
        if (!h.has(field)) {
            r = 1;
            h.set(field, value);
        }
        return r;
    }
    hmget(conn, key, ...fields) {
        this.checkMinArgCount('hmget', arguments, 3);
        let r = [];
        let h = this.getDataset(key);
        for (let i = 0; i < fields.length; i++) {
            if (h) {
                let field = fields[i];
                if (h.has(field)) {
                    r.push(h.get(field));
                }
                else {
                    r.push(null);
                }
            }
            else {
                r.push(null);
            }
        }
        return r;
    }
    hmset(conn, key, field, value, ...fieldsValues) {
        this.checkMinArgCount('hmset', arguments, 4);
        let r = 'OK';
        let h = this.getOrCreate(key);
        this.hset(conn, key, field, value);
        for (let i = 0; i < fieldsValues.length; i++) {
            this.hset(conn, key, fieldsValues[i], fieldsValues[i + 1]);
            i++;
        }
        return r;
    }
    hgetall(conn, key) {
        this.checkArgCount('hgetall', arguments, 2);
        let h = this.getDataset(key);
        let r = [];
        if (h) {
            h.forEach((value, field) => {
                r.push(field);
                r.push(value);
            });
        }
        return r;
    }
    hexists(conn, key, field) {
        this.checkArgCount('hexists', arguments, 3);
        let h = this.getDataset(key);
        let r = 0;
        if (h && h.has(field)) {
            r = 1;
        }
        return r;
    }
    hdel(conn, key, ...fields) {
        this.checkMinArgCount('hdel', arguments, 3);
        let h = this.getDataset(key);
        let r = 0;
        if (h) {
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                if (h.has(field)) {
                    h.delete(field);
                    r++;
                }
            }
        }
        return r;
    }
    hkeys(conn, key) {
        this.checkArgCount('hkeys', arguments, 2);
        let h = this.getDataset(key);
        let r = [];
        if (h) {
            h.forEach((value, field) => {
                r.push(field);
            });
        }
        return r;
    }
    hlen(conn, key) {
        this.checkArgCount('hlen', arguments, 2);
        let h = this.getDataset(key);
        let r = 0;
        if (h) {
            r = h.size;
        }
        return r;
    }
    hincrby(conn, key, field, incr) {
        this.checkArgCount('hincrby', arguments, 4);
        if (typeof incr === 'string') {
            incr = parseInt(incr, 10);
        }
        if (typeof incr !== 'number') {
            throw 'WRONGTYPE incr argument is not integer (' + incr + ')';
        }
        return this._incr(conn, key, field, incr);
    }
    hincrbyfloat(conn, key, field, incr) {
        this.checkArgCount('hincrbyfloat', arguments, 4);
        if (typeof incr === 'string') {
            incr = parseFloat(incr);
        }
        if (typeof incr !== 'number') {
            throw 'WRONGTYPE incr argument is not float (' + incr + ')';
        }
        return this._incr(conn, key, field, incr);
    }
    _incr(conn, key, field, incr) {
        let h = this.getOrCreate(key);
        let value = 0;
        if (h.has(field)) {
            value = h.get(field);
        }
        value += incr;
        h.set(field, value);
        return value;
    }
    getDataset(key) {
        let r = this.db.getDataset(key);
        if (r && !(r instanceof Map)) {
            throw 'WRONGTYPE Operation against a key holding the wrong kind of value';
        }
        return r;
    }
    createNewKey(key) {
        return this.db.createNewKey(key, new Map());
    }
    onTimer() {
    }
}
exports.Hashes = Hashes;
//# sourceMappingURL=Hashes.js.map
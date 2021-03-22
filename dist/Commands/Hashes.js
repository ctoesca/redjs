"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hashes = void 0;
const AbstractCommands_1 = require("./AbstractCommands");
const utils = require("../utils");
const MapDataset_1 = require("../Data/MapDataset");
const RedisError_1 = require("../RedisError");
class Hashes extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
        this.clientsCursors = {};
        this.defaultScancount = 10;
        this.lastCursorId = 1;
    }
    getCommandsNames() {
        return ['hget', 'hset', 'hdel', 'hexists', 'hgetall', 'hincrby', 'hincrbyfloat',
            'hkeys', 'hlen', 'hmget', 'hmset', 'hsetnx', 'hstrlen', 'hvals', 'hscan'];
    }
    getNotImplementedCommands() {
        return [
            'hrandfield'
        ];
    }
    hscan(conn, key, cursor, ...options) {
        this.checkArgCount('hscan', arguments, 3, 7);
        let argsNames = ['match', 'count'];
        let args = {};
        if (options.length > argsNames.length * 2) {
            throw new RedisError_1.RedisError('ERR Too many arguments');
        }
        if (options.length % 2 !== 0) {
            throw new RedisError_1.RedisError('ERR Invalid arguments count');
        }
        for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            if (typeof opt === 'string') {
                opt = opt.toLowerCase();
            }
            if (argsNames.indexOf(opt) >= 0) {
                if (typeof args[opt] !== 'undefined') {
                    throw new RedisError_1.RedisError('ERR Argument \'' + opt + '\' defined twice');
                }
                args[opt] = options[i + 1];
            }
            else {
                throw new RedisError_1.RedisError('ERR unknown argument: \'' + opt + '\'');
            }
            i++;
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
        throw new RedisError_1.RedisError('ERR Not yet implemented');
    }
    hget(conn, key, field) {
        this.checkArgCount('hget', arguments, 3);
        let r = null;
        let h = this.getDataset(conn.database, key);
        if (h && h.has(field)) {
            r = h.get(field);
        }
        return r;
    }
    hvals(conn, key) {
        this.checkArgCount('hvals', arguments, 2);
        let h = this.getDataset(conn.database, key);
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
        let h = this.getDataset(conn.database, key);
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
        let h = this.getOrCreate(conn.database, key);
        let r = 0;
        if (!h.has(field)) {
            r = 1;
        }
        h.set(field, value);
        return r;
    }
    hsetnx(conn, key, field, value) {
        this.checkArgCount('hsetnx', arguments, 4);
        let h = this.getDataset(conn.database, key);
        let r = 0;
        if (!h) {
            h = this.createNewKey(conn.database, key);
            r = 1;
        }
        if (!h.has(field)) {
            r = 1;
            h.set(field, value);
        }
        return r;
    }
    hmget(conn, key, ...fields) {
        this.checkArgCount('hmget', arguments, 3, -1);
        let r = [];
        r.length = fields.length;
        let h = this.getDataset(conn.database, key);
        if (h) {
            for (let i = 0; i < fields.length; i++) {
                let value = h.get(fields[i]);
                if (value === undefined) {
                    r[i] = null;
                }
                else {
                    r[i] = value;
                }
            }
        }
        else {
            for (let i = 0; i < fields.length; i++) {
                r[i] = null;
            }
        }
        return r;
    }
    hmset(conn, key, field, value, ...fieldsValues) {
        this.checkArgCount('hmset', arguments, 4, -1);
        let r = 'OK';
        let h = this.getOrCreate(conn.database, key);
        this.hset(conn, key, field, value);
        for (let i = 0; i < fieldsValues.length; i++) {
            this.hset(conn, key, fieldsValues[i], fieldsValues[i + 1]);
            i++;
        }
        return r;
    }
    hgetall(conn, key) {
        this.checkArgCount('hgetall', arguments, 2);
        let h = this.getDataset(conn.database, key);
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
        let h = this.getDataset(conn.database, key);
        let r = 0;
        if (h && h.has(field)) {
            r = 1;
        }
        return r;
    }
    hdel(conn, key, ...fields) {
        this.checkArgCount('hdel', arguments, 3, -1);
        let h = this.getDataset(conn.database, key);
        if (!h) {
            return 0;
        }
        let r = 0;
        for (let field of fields) {
            if (h.has(field)) {
                h.delete(field);
                r++;
            }
        }
        return r;
    }
    hkeys(conn, key) {
        this.checkArgCount('hkeys', arguments, 2);
        let h = this.getDataset(conn.database, key);
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
        let h = this.getDataset(conn.database, key);
        let r = 0;
        if (h) {
            r = h.size;
        }
        return r;
    }
    hincrby(conn, key, field, incr) {
        this.checkArgCount('hincrby', arguments, 4);
        if (!utils.isInt(incr)) {
            throw new RedisError_1.RedisError('ERR value is not an integer or out of range');
        }
        incr = parseInt(incr, 10);
        return this._incr(conn, key, field, incr);
    }
    hincrbyfloat(conn, key, field, incr) {
        this.checkArgCount('hincrbyfloat', arguments, 4);
        if (!utils.isFloat(incr)) {
            throw new RedisError_1.RedisError('WRONGTYPE incr argument is not float (' + incr + ')');
        }
        incr = parseFloat(incr);
        return this._incr(conn, key, field, incr);
    }
    _incr(conn, key, field, incr) {
        let h = this.getOrCreate(conn.database, key);
        let value = 0;
        if (h.has(field)) {
            value = h.get(field);
        }
        if (!utils.isInt(value))
            throw new RedisError_1.RedisError('ERR hash value is not an integer');
        value += incr;
        h.set(field, value);
        return value;
    }
    getDataset(db, key) {
        let r = db.getDataset(key);
        this.checkType(r, MapDataset_1.MapDataset);
        return r;
    }
    createNewKey(db, key) {
        return db.createMapDataset(key);
    }
}
exports.Hashes = Hashes;
//# sourceMappingURL=Hashes.js.map
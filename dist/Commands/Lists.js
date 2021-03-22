"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lists = void 0;
const AbstractCommands_1 = require("./AbstractCommands");
const ListDataset_1 = require("../Data/ListDataset");
const RedisError_1 = require("../RedisError");
class Lists extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['lindex', 'linsert', 'llen', 'lpop', 'lpush', 'lrange', 'rpop', 'rpush', 'lset'];
    }
    getNotImplementedCommands() {
        return ['blpop', 'brpop', 'brpoplpush', 'rpoplpush', 'blmove', 'lmove', 'lpushx', 'ltrim', 'lrem', 'lpos', 'rpushx'];
    }
    lrange(conn, key, start, stop) {
        this.checkArgCount('lrange', arguments, 4);
        this.checkInt(start);
        this.checkInt(stop);
        let data = this.getDataset(conn.database, key);
        let r = [];
        if (!data) {
            return r;
        }
        let startIndx = this.normalizeIndex(start, data);
        let stopIndx = this.normalizeIndex(stop, data);
        if ((startIndx >= 0) && (startIndx < data.length) && (startIndx <= stopIndx)) {
            for (let i = startIndx; (i <= stopIndx) && (i < data.length); i++) {
                r.push(data[i]);
            }
        }
        return r;
    }
    lindex(conn, key, index) {
        this.checkArgCount('lindex', arguments, 3);
        this.checkInt(index);
        let data = this.getDataset(conn.database, key);
        if (!data) {
            throw new RedisError_1.RedisError('ERR no such key');
        }
        let r = null;
        let indx = this.normalizeIndex(index, data);
        if ((indx >= 0) && (indx < data.length)) {
            r = data[indx];
        }
        return r;
    }
    lset(conn, key, index, value) {
        this.checkArgCount('lindex', arguments, 4);
        this.checkInt(index);
        let r = 'OK';
        let data = this.getDataset(conn.database, key);
        if (!data) {
            throw new RedisError_1.RedisError('ERR no such key');
        }
        let indx = this.normalizeIndex(index, data);
        if ((indx >= 0) && (indx < data.length)) {
            data[indx] = value;
        }
        else {
            throw new RedisError_1.RedisError('ERR value is not an integer or out of range');
        }
        return r;
    }
    linsert(conn, key, position, pivot, value) {
        this.checkArgCount('linsert', arguments, 5);
        if (['BEFORE', 'AFTER'].indexOf(position) === -1) {
            throw new RedisError_1.RedisError('ERR syntax error');
        }
        let h = this.getDataset(conn.database, key);
        if (!h) {
            return 0;
        }
        let r = -1;
        let indx = h.indexOf(pivot);
        if (indx >= 0) {
            let spliceIndex = indx;
            if (position === 'AFTER') {
                spliceIndex = indx + 1;
            }
            h.splice(spliceIndex, 0, value);
            r = h.length;
        }
        return r;
    }
    lpush(conn, key, ...values) {
        this.checkArgCount('lpush', arguments, 3, -1);
        let h = this.getOrCreate(conn.database, key);
        for (let v of values) {
            h.splice(0, 0, v);
        }
        return h.length;
    }
    rpush(conn, key, ...values) {
        this.checkArgCount('rpush', arguments, 3, -1);
        let h = this.getOrCreate(conn.database, key);
        for (let v of values) {
            h.push(v);
        }
        return h.length;
    }
    rpop(conn, key) {
        this.checkArgCount('rpop', arguments, 2);
        return this._pop(conn, key, 'right');
    }
    lpop(conn, key) {
        this.checkArgCount('lpop', arguments, 2);
        return this._pop(conn, key, 'left');
    }
    llen(conn, key) {
        this.checkArgCount('llen', arguments, 2);
        let h = this.getDataset(conn.database, key);
        let r = 0;
        if (h) {
            r = h.length;
        }
        return r;
    }
    normalizeIndex(index, arr) {
        let r;
        index = parseInt(index, 10);
        if (index >= 0) {
            r = index;
        }
        else {
            r = arr.length + index;
        }
        return r;
    }
    _pop(conn, key, type = null) {
        let r = null;
        let h = this.getDataset(conn.database, key);
        if (h && h.length > 0) {
            if (type === 'left') {
                r = h.shift();
            }
            else if (type === 'right') {
                r = h.pop();
            }
            else {
                throw new RedisError_1.RedisError('ERR syntax error');
            }
        }
        return r;
    }
    getDataset(db, key) {
        let r = db.getDataset(key);
        this.checkType(r, ListDataset_1.ListDataset);
        return r;
    }
    createNewKey(db, key) {
        return db.createListDataset(key);
    }
}
exports.Lists = Lists;
//# sourceMappingURL=Lists.js.map
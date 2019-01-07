"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommands_1 = require("./AbstractCommands");
class Lists extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['blpop', 'brpop', 'BRPOPLPUSH', 'LINDEX', 'LINSERT', 'LLEN', 'LPOP', 'LPUSH',
            'LPUSH', 'LPUSHX', 'LRANGE', 'LREM', 'LSET', 'LTRIM', 'RPOP', 'RPOPLPUSH', 'RPUSH', 'RPUSHX'];
    }
    lrange(conn, key, start, stop) {
        this.checkArgCount('lrange', arguments, 4);
        this.checkInt(start);
        this.checkInt(stop);
        let data = this.getDataset(conn.database, key);
        let r = [];
        if (data) {
            let startIndx = this.normalizeIndex(start, data);
            let stopIndx = this.normalizeIndex(stop, data);
            if ((startIndx >= 0) && (startIndx < data.length) && (startIndx <= stopIndx)) {
                for (let i = startIndx; (i <= stopIndx) && (i < data.length); i++) {
                    r.push(data[i]);
                }
            }
        }
        return r;
    }
    lindex(conn, key, index) {
        this.checkArgCount('lindex', arguments, 3);
        this.checkInt(index);
        let data = this.getDataset(conn.database, key);
        if (!data) {
            throw key + ' is not a list';
        }
        let r = null;
        let indx = this.normalizeIndex(index, data);
        if ((indx >= 0) && (indx < data.length)) {
            r = data[indx];
        }
        return r;
    }
    linsert(conn, key, position, pivot, value) {
        this.checkArgCount('linsert', arguments, 5);
        if (['BEFORE', 'AFTER'].indexOf(position) == -1) {
            throw 'Invalid argument';
        }
        let h = this.getDataset(conn.database, key);
        if (!h)
            return 0;
        let r = -1;
        let added = false;
        for (let i = 0; i < h.length; i++) {
            if (h[i] === pivot) {
                let spliceIndx;
                (position === 'AFTER') ? spliceIndx = i + 1 : spliceIndx = i;
                h[i].splice(spliceIndx, 0, value);
                r = h.length;
                break;
            }
        }
        return r;
    }
    lset(conn, key, index, value) {
        this.checkArgCount('lset', arguments, 4);
        this.checkInt(index);
        let r = 'OK';
        let data = this.getDataset(conn.database, key);
        if (!data) {
            throw key + ' is not a list';
        }
        let indx = this.normalizeIndex(index, data);
        if ((indx >= 0) && (indx < data.length)) {
            data[indx] = value;
        }
        else {
            throw 'Out of range';
        }
        return r;
    }
    lpush(conn, key, ...values) {
        this.checkMinArgCount('lpush', arguments, 3);
        let h = this.getOrCreate(conn.database, key);
        for (let v of values) {
            h.splice(0, 0, v);
        }
        return h.length;
    }
    rpush(conn, key, ...values) {
        this.checkMinArgCount('rpush', arguments, 3);
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
    getDataset(db, key) {
        let r = db.getDataset(key);
        if (r && (typeof r.push === 'undefined')) {
            throw 'WRONGTYPE Operation against a key holding the wrong kind of value';
        }
        return r;
    }
    createNewKey(db, key) {
        return db.createNewKey(key, []);
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
                throw "Invalid option: type='" + type + "'";
            }
        }
        return r;
    }
}
exports.Lists = Lists;
//# sourceMappingURL=Lists.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDataManagers_1 = require("./BaseDataManagers");
class Lists extends BaseDataManagers_1.BaseDataManagers {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['blpop', 'brpop', 'BRPOPLPUSH', 'LINDEX', 'LINSERT', 'LLEN', 'LPOP', 'LPUSH',
            'LPUSH', 'LPUSHX', 'LRANGE', 'LREM', 'LSET', 'LTRIM', 'RPOP', 'RPOPLPUSH', 'RPUSH', 'RPUSHX'];
    }
    lindex(conn, key, index) {
        this.checkArgCount('lindex', arguments, 3);
        let h = this.getDataset(key);
        if (!h) {
            throw key + ' is not a list';
        }
        if (typeof index === 'string') {
            index = parseInt(index, 10);
        }
        let r = null;
        let indx;
        if (index >= 0) {
            indx = index;
        }
        else {
            indx = h.length + index;
        }
        if ((indx >= 0) && (indx < h.length)) {
            r = h[indx];
        }
        return r;
    }
    linsert(conn, key, position, pivot, value) {
        this.checkArgCount('linsert', arguments, 5);
        if ((position !== 'BEFORE') && (position !== 'AFTER')) {
            throw 'Invalid argument';
        }
        if (arguments.length < 5) {
            throw 'Invalid argument';
        }
        let r = -1;
        let h = this.getDataset(key);
        if (h) {
            for (let i = 0; i < h.length; i++) {
                if (h[i] === pivot) {
                    if (position === 'BEFORE') {
                        h.splice(i, 0, value);
                    }
                    else {
                        h.splice(i + 1, 0, value);
                    }
                    i++;
                    r = h.length;
                }
            }
        }
        else {
            r = 0;
        }
        return r;
    }
    lset(conn, key, index, value) {
        this.checkArgCount('lset', arguments, 4);
        let r = 'OK';
        let h = this.getDataset(key);
        if (!h) {
            throw key + ' is not a list';
        }
        if (typeof index === 'string') {
            index = parseInt(index, 10);
        }
        let indx;
        if (index >= 0) {
            indx = index;
        }
        else {
            indx = h.length + index;
        }
        if ((indx >= 0) && (indx < h.length)) {
            h[indx] = value;
        }
        else {
            throw 'Out of range';
        }
        return r;
    }
    lpush(conn, key, ...values) {
        this.checkMinArgCount('lpush', arguments, 3);
        let h = this.getOrCreate(key);
        for (let v of values) {
            h.splice(0, 0, v);
        }
        return h.length;
    }
    rpush(conn, key, ...values) {
        this.checkMinArgCount('rpush', arguments, 3);
        let h = this.getOrCreate(key);
        for (let v of values) {
            h.push(v);
        }
        return h.length;
    }
    rpop(conn, key) {
        this.checkArgCount('rpop', arguments, 2);
        let h = this.getDataset(key);
        let r = null;
        if (h && h.length > 0) {
            r = h.pop();
        }
        return r;
    }
    lpop(conn, key) {
        this.checkArgCount('lpop', arguments, 2);
        let h = this.getDataset(key);
        let r = null;
        if (h && h.length > 0) {
            r = h.shift();
        }
        return r;
    }
    llen(conn, key) {
        this.checkArgCount('llen', arguments, 2);
        let h = this.getDataset(key);
        let r = 0;
        if (h) {
            r = h.length;
        }
        return r;
    }
    getDataset(key) {
        let r = this.db.getDataset(key);
        if (r && (typeof r.push === 'undefined')) {
            throw 'WRONGTYPE Operation against a key holding the wrong kind of value';
        }
        return r;
    }
    createNewKey(key) {
        return this.db.createNewKey(key, []);
    }
    onTimer() {
    }
}
exports.Lists = Lists;
//# sourceMappingURL=Lists.js.map
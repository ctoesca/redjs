"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommands_1 = require("./AbstractCommands");
const utils = require("../utils");
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
        if (!utils.isInt(start)) {
            throw 'ERR value is not an integer or out of range';
        }
        if (!utils.isInt(stop)) {
            throw 'ERR value is not an integer or out of range';
        }
        let data = this.getDataset(conn.database, key);
        let r = [];
        if (data) {
            start = parseInt(start, 10);
            stop = parseInt(stop, 10);
            let startIndx;
            if (start >= 0) {
                startIndx = start;
            }
            else {
                startIndx = data.length + start;
            }
            let stopIndx;
            if (stop >= 0) {
                stopIndx = stop;
            }
            else {
                stopIndx = data.length + stop;
            }
            if (((startIndx >= 0) && (startIndx < data.length)) && (startIndx <= stopIndx)) {
                for (let i = startIndx; i <= stopIndx; i++) {
                    if (i < data.length) {
                        r.push(data[i]);
                    }
                }
            }
        }
        return r;
    }
    lindex(conn, key, index) {
        this.checkArgCount('lindex', arguments, 3);
        let h = this.getDataset(conn.database, key);
        if (!h) {
            throw key + ' is not a list';
        }
        if (!utils.isInt(index)) {
            throw 'ERR value is not an integer or out of range';
        }
        index = parseInt(index, 10);
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
        let r = -1;
        let h = this.getDataset(conn.database, key);
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
        let h = this.getDataset(conn.database, key);
        if (!h) {
            throw key + ' is not a list';
        }
        if (!utils.isInt(index)) {
            throw 'ERR value is not an integer or out of range';
        }
        index = parseInt(index, 10);
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
        let h = this.getDataset(conn.database, key);
        let r = null;
        if (h && h.length > 0) {
            r = h.pop();
        }
        return r;
    }
    lpop(conn, key) {
        this.checkArgCount('lpop', arguments, 2);
        let h = this.getDataset(conn.database, key);
        let r = null;
        if (h && h.length > 0) {
            r = h.shift();
        }
        return r;
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
    onTimer() {
    }
}
exports.Lists = Lists;
//# sourceMappingURL=Lists.js.map
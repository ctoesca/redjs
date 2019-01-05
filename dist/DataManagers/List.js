"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDataset_1 = require("./BaseDataset");
class Lists extends BaseDataset_1.BaseDataset {
    constructor(opt) {
        super(opt);
        this.data = [];
    }
    getCommandsNames() {
        return ['blpop', 'brpop', 'BRPOPLPUSH', 'LINDEX', 'LINSERT', 'LLEN', 'LPOP', 'LPUSH',
            'LPUSH', 'LPUSHX', 'LRANGE', 'LREM', 'LSET', 'LTRIM', 'RPOP', 'RPOPLPUSH', 'RPUSH', 'RPUSHX'];
    }
    lindex(conn, index) {
        this.checkArgCount('lindex', arguments, 3);
        if (typeof index === 'string') {
            index = parseInt(index, 10);
        }
        let r = null;
        let indx;
        if (index >= 0) {
            indx = index;
        }
        else {
            indx = this.data.length + index;
        }
        if ((indx >= 0) && (indx < this.data.length)) {
            r = this.data[indx];
        }
        return r;
    }
    linsert(conn, position, pivot, value) {
        this.checkArgCount('linsert', arguments, 5);
        if ((position !== 'BEFORE') && (position !== 'AFTER')) {
            throw 'Invalid argument';
        }
        if (arguments.length < 5) {
            throw 'Invalid argument';
        }
        let r = -1;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === pivot) {
                if (position === 'BEFORE') {
                    this.data.splice(i, 0, value);
                }
                else {
                    this.data.splice(i + 1, 0, value);
                }
                i++;
                r = this.data.length;
            }
        }
        return r;
    }
    lset(conn, index, value) {
        this.checkArgCount('lset', arguments, 4);
        let r = 'OK';
        if (typeof index === 'string') {
            index = parseInt(index, 10);
        }
        let indx;
        if (index >= 0) {
            indx = index;
        }
        else {
            indx = this.data.length + index;
        }
        if ((indx >= 0) && (indx < this.data.length)) {
            this.data[indx] = value;
        }
        else {
            throw 'Out of range';
        }
        return r;
    }
    lpush(conn, ...values) {
        this.checkMinArgCount('lpush', arguments, 3);
        for (let v of values) {
            this.data.splice(0, 0, v);
        }
        return this.data.length;
    }
    rpush(conn, ...values) {
        this.checkMinArgCount('rpush', arguments, 3);
        for (let v of values) {
            this.data.push(v);
        }
        return this.data.length;
    }
    rpop(conn) {
        this.checkArgCount('rpop', arguments, 2);
        let r = null;
        if (this.data.length > 0) {
            r = this.data.pop();
        }
        return r;
    }
    lpop(conn) {
        this.checkArgCount('lpop', arguments, 2);
        let r = null;
        if (this.data.length > 0) {
            r = this.data.shift();
        }
        return r;
    }
    llen(conn) {
        this.checkArgCount('llen', arguments, 2);
        let r = this.data.length;
        return r;
    }
}
exports.Lists = Lists;
//# sourceMappingURL=List.js.map
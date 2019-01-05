"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDataManagers_1 = require("./BaseDataManagers");
class Keys extends BaseDataManagers_1.BaseDataManagers {
    constructor(opt) {
        super(opt);
        this.data = new Map();
    }
    getCommandsNames() {
        return ['DEL', 'DUMP', 'EXISTS', 'EXPIRE', 'EXPIREAT', 'KEYS', 'MIGRATE', 'MOVE', 'OBJECT', 'PERSIST',
            'PEXPIRE', 'PEXPIREAT', 'PTTL', 'RANDOMKEY', 'RENAME', 'RENAMENX', 'RESTORE', 'SORT', 'TOUCH', 'TTL', 'TYPE', 'UNLINK', 'WAIT', 'SCAN'];
    }
    clear() {
        this.data.clear();
    }
    get(key) {
        return this.data.get(key);
    }
    set(key, object) {
        if (this.data.has(key)) {
            throw 'key \'' + key + ' already exists';
        }
        this.data.set(key, object);
        return object;
    }
    del(conn, key, ...keys) {
        this.checkMinArgCount('get', arguments, 2);
        let r = 0;
        if (this.data.has(key)) {
            this.data.delete(key);
            r++;
        }
        for (let i = 0; i < keys.length; i++) {
            if (this.data.has(keys[i])) {
                this.data.delete(keys[i]);
                r++;
            }
        }
        return r;
    }
    exists(conn, key, ...keys) {
        this.checkMinArgCount('get', arguments, 2);
        let r = 0;
        if (this.data.has(key)) {
            this.data.delete(key);
            r++;
        }
        for (let i = 0; i < keys.length; i++) {
            if (this.data.has(key)) {
                r++;
            }
        }
        return r;
    }
    keys(conn, pattern) {
        this.checkArgCount('keys', arguments, 2);
        let r = [];
        this.data.forEach((value, key) => {
            if (this.match(key, pattern)) {
                r.push(key);
            }
        });
        return r;
    }
    onTimer() {
    }
}
exports.Keys = Keys;
//# sourceMappingURL=Keys.js.map
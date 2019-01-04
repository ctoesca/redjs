"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDataManagers_1 = require("./BaseDataManagers");
class Keys extends BaseDataManagers_1.BaseDataManagers {
    constructor(opt) {
        super(opt);
    }
    static getCommandsNames() {
        return ['get', 'set', 'incr', 'DEL', 'DUMP', 'EXISTS', 'EXPIRE', 'EXPIREAT', 'KEYS', 'MIGRATE', 'MOVE', 'OBJECT', 'PERSISTS',
            'PEXPIRE', 'PEXPIREAT', 'PTTL', 'RANDOMKEY', 'RENAME', 'RENAMENX', 'RESTORE', 'SORT', 'TOUCH', 'TTL', 'TYPE', 'UNLINK', 'WAIT', 'SCAN'];
    }
    get(conn, key) {
        this.checkArgCount('get', arguments, 2);
        let r = null;
        if (typeof this.data[key] !== 'undefined') {
            r = this.data[key];
        }
        return r;
    }
    set(conn, key, value) {
        this.checkArgCount('set', arguments, 3);
        let r = 0;
        if (typeof this.data[key] === 'undefined') {
            r = 1;
        }
        this.data[key] = value;
        return r;
    }
    incr(conn, key) {
        this.checkArgCount('incr', arguments, 2);
        if (typeof this.data[key] === 'undefined') {
            this.data[key] = 0;
        }
        else {
            if (typeof this.data[key] === 'number') {
                this.data[key]++;
            }
            else {
                throw key + ' is not integer';
            }
        }
        let r = this.data[key];
        return r;
    }
    onTimer() {
    }
}
exports.Keys = Keys;
//# sourceMappingURL=Keys.js.map
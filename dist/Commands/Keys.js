"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommands_1 = require("./AbstractCommands");
class Keys extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['DEL', 'DUMP', 'EXISTS', 'EXPIRE', 'EXPIREAT', 'KEYS', 'MIGRATE', 'MOVE', 'OBJECT', 'PERSIST',
            'PEXPIRE', 'PEXPIREAT', 'PTTL', 'RANDOMKEY', 'RENAME', 'RENAMENX', 'RESTORE', 'SORT', 'TOUCH', 'TTL', 'TYPE', 'UNLINK', 'WAIT', 'SCAN'];
    }
    scan(conn, cursor, MATCH, pattern, COUNT, count) {
        this.checkArgCount('scan', arguments, 6);
        let r = [0, []];
        conn.database.keys.forEach((value, key) => {
            if (this.match(key, pattern)) {
                r[1].push(key);
            }
        });
        return r;
    }
    del(conn, key, ...keys) {
        this.checkMinArgCount('get', arguments, 2);
        let r = 0;
        if (conn.database.keys.has(key)) {
            conn.database.keys.delete(key);
            r++;
        }
        for (let i = 0; i < keys.length; i++) {
            if (conn.database.keys.has(keys[i])) {
                conn.database.keys.delete(keys[i]);
                r++;
            }
        }
        return r;
    }
    exists(conn, key, ...keys) {
        this.checkMinArgCount('exists', arguments, 2);
        let r = 0;
        if (conn.database.keys.has(key)) {
            r = 1;
        }
        for (let i = 0; i < keys.length; i++) {
            if (conn.database.keys.has(keys[0])) {
                r++;
            }
        }
        return r;
    }
    keys(conn, pattern) {
        this.checkArgCount('keys', arguments, 2);
        let r = [];
        conn.database.keys.forEach((value, key) => {
            if (this.match(key, pattern)) {
                r.push(key);
            }
        });
        return r;
    }
}
exports.Keys = Keys;
//# sourceMappingURL=Keys.js.map
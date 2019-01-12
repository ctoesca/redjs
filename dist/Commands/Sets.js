"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommands_1 = require("./AbstractCommands");
const sha1 = require("sha1");
class Sets extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['SADD', 'SCARD', 'SDIFF', 'SDIFFSTORE', 'SINTER', 'SINTERSTORE', 'SISMEMBER', 'SMEMBERS',
            'SMOVE', 'SPOP', 'SRANDMEMBER', 'SREM', 'SUNION', 'SUNIONSTORE', 'SSCAN'];
    }
    sismember(conn, key, member) {
        this.checkArgCount('srem', arguments, 3, 3);
        let set = this.getDataset(conn.database, key);
        if (!set)
            return 0;
        let r = 0;
        if (set.has(member))
            r = 1;
        return r;
    }
    sunion(conn, ...keys) {
        this.checkArgCount('sinter', arguments, 3, -1);
        let r = [];
        let rTmp = new Map();
        for (let key of keys) {
            let set = this.getDataset(conn.database, key);
            if (set) {
                let iterator = set.values();
                for (let v of iterator) {
                    let hash = sha1(v).toString();
                    rTmp.set(hash, v);
                }
            }
        }
        rTmp.forEach((value, field) => {
            r.push(value);
        });
        return r;
    }
    srem(conn, key, ...members) {
        this.checkArgCount('srem', arguments, 3, -1);
        let set = this.getDataset(conn.database, key);
        let r = 0;
        if (!set)
            return r;
        for (let member of members) {
            if (set.delete(member)) {
                r++;
            }
        }
        return r;
    }
    sadd(conn, key, ...members) {
        this.checkArgCount('sadd', arguments, 3, -1);
        let r = 0;
        let set = this.getOrCreate(conn.database, key);
        if (!set)
            return r;
        for (let member of members) {
            if (!set.has(member)) {
                set.add(member);
                r++;
            }
        }
        return r;
    }
    smembers(conn, key) {
        this.checkArgCount('smembers', arguments, 2);
        let set = this.getDataset(conn.database, key);
        let r = [];
        if (set) {
            let iterator = set.values();
            for (let v of iterator) {
                r.push(v);
            }
        }
        return r;
    }
    spop(conn, key, count = 1) {
        this.checkArgCount('spop', arguments, 2, 3);
        this.checkInt(count);
        let set = this.getDataset(conn.database, key);
        if (!set)
            return null;
        if ((count <= 0) || (count > set.size)) {
            throw 'ERR value out of range';
        }
        if (set.size === 0) {
            return null;
        }
        let r = [];
        let iterator = set.values();
        let toDelete = [];
        for (var i = 1; i <= count; i++) {
            let member = iterator.next().value;
            r.push(member);
            toDelete.push(member);
        }
        for (let member of toDelete) {
            set.delete(member);
        }
        return r;
    }
    getDataset(db, key) {
        let r = db.getDataset(key);
        this.checkType(r, Set);
        return r;
    }
    createNewKey(db, key) {
        return db.createNewKey(key, new Set());
    }
}
exports.Sets = Sets;
//# sourceMappingURL=Sets.js.map
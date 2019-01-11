"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommands_1 = require("./AbstractCommands");
class Sets extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['SADD', 'SCARD', 'SDIFF', 'SDIFFSTORE', 'SINTER', 'SINTERSTORE', 'SISMEMBER', 'SMEMBERS',
            'SMOVE', 'SPOP', 'SRANDMEMBER', 'SREM', 'SUNION', 'SUNIONSTORE', 'SSCAN'];
    }
    srem(conn, key, ...members) {
        this.checkArgCount('srem', arguments, 3, -1);
        let set = this.getDataset(conn.database, key);
        let r = 0;
        if (set) {
            for (let member of members) {
                if (set.delete(member)) {
                    r++;
                }
            }
        }
        return r;
    }
    sadd(conn, key, ...members) {
        this.checkArgCount('sadd', arguments, 3, -1);
        let r = 0;
        let set = this.getOrCreate(conn.database, key);
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
        let set = this.getDataset(conn.database, key);
        if ((set == null) || (set.size == 0))
            return null;
        this.checkInt(count);
        if ((count <= 0) || (count > set.size))
            throw 'ERR value out of range';
        let r = [];
        let iterator = set.keys();
        let toDelete = [];
        for (let member of iterator) {
            r.push(member);
            toDelete.push(member);
            if (r.length >= count)
                break;
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
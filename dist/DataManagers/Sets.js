"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDataManagers_1 = require("./BaseDataManagers");
class Sets extends BaseDataManagers_1.BaseDataManagers {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['SADD', 'SCARD', 'SDIFF', 'SDIFFSTORE', 'SINTER', 'SINTERSTORE', 'SISMEMBER', 'SMEMBERS',
            'SMOVE', 'SPOP', 'SRANDMEMBER', 'SREM', 'SUNION', 'SUNIONSTORE', 'SSCAN'];
    }
    srem(conn, key, ...members) {
        this.checkMinArgCount('srem', arguments, 3);
        let set = this.getDataset(key);
        let r = 0;
        if (set) {
            for (let i = 0; i < members.length; i++) {
                let member = members[i];
                if (set.delete(member)) {
                    r++;
                }
            }
        }
        return r;
    }
    sadd(conn, key, ...members) {
        this.checkMinArgCount('sadd', arguments, 3);
        let r = 0;
        let set = this.getOrCreate(key);
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            if (!set.has(member)) {
                set.add(member);
                r++;
            }
        }
        return r;
    }
    smembers(conn, key) {
        this.checkArgCount('smembers', arguments, 2);
        let r = [];
        if (typeof this.data[key] !== 'undefined') {
            let iterator = this.data[key].values();
            for (let v of iterator) {
                r.push(v);
            }
        }
        return r;
    }
    getDataset(key) {
        let r = this.db.getDataset(key);
        if (r && !(r instanceof Set)) {
            throw 'WRONGTYPE Operation against a key holding the wrong kind of value';
        }
        return r;
    }
    createNewKey(key) {
        return this.db.createNewKey(key, new Set());
    }
    onTimer() {
    }
}
exports.Sets = Sets;
//# sourceMappingURL=Sets.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDataset_1 = require("./BaseDataset");
class RedisSet extends BaseDataset_1.BaseDataset {
    constructor(opt) {
        super(opt);
        this.data = new Set();
    }
    getCommandsNames() {
        return ['SADD', 'SCARD', 'SDIFF', 'SDIFFSTORE', 'SINTER', 'SINTERSTORE', 'SISMEMBER', 'SMEMBERS',
            'SMOVE', 'SPOP', 'SRANDMEMBER', 'SREM', 'SUNION', 'SUNIONSTORE', 'SSCAN'];
    }
    srem(conn, ...members) {
        this.checkMinArgCount('srem', arguments, 3);
        let r = 0;
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            if (this.data.delete(member)) {
                r++;
            }
        }
        return r;
    }
    sadd(conn, ...members) {
        this.checkMinArgCount('sadd', arguments, 3);
        let r = 0;
        for (let i = 0; i < members.length; i++) {
            let member = members[i];
            if (!this.data.has(member)) {
                this.data.add(member);
                r++;
            }
        }
        return r;
    }
    smembers(conn) {
        this.checkArgCount('smembers', arguments, 2);
        let r = [];
        let iterator = this.data.values();
        for (let v of iterator) {
            r.push(v);
        }
        return r;
    }
}
exports.RedisSet = RedisSet;
//# sourceMappingURL=Set.js.map
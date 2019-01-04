"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDataManagers_1 = require("./BaseDataManagers");
class SortedSets extends BaseDataManagers_1.BaseDataManagers {
    constructor(opt) {
        super(opt);
    }
    static getCommandsNames() {
        return ['BZPOPMIN', 'BZPOPMAX', 'ZADD', 'ZCARD', 'ZCOUNT', 'ZINCRBY', 'ZINTERSTORE', 'ZLEXCOUNT', 'ZPOPMAX', 'ZPOPMIN', 'ZRANGE',
            'ZRANGEBYLEX', 'ZREVRANGEBYLEX', 'ZRANGEBYSCORE', 'ZRANK', 'ZREM', 'ZREMRANGEBYLEX', 'ZREMRANGEBYRANK', 'ZREMRANGEBYSCORE',
            'ZREVRANGE', 'ZREVRANGEBYSCORE', 'ZREVRANK', 'ZSCORE', 'ZUNIONSTORE', 'ZSCAN'];
    }
}
exports.SortedSets = SortedSets;
//# sourceMappingURL=SortedSets.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortedSetsCommnand = void 0;
const AbstractCommands_1 = require("./AbstractCommands");
class SortedSetsCommnand extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return [];
    }
    getNotImplementedCommands() {
        return [
            'bzpopmax',
            'bzpopmin',
            'zadd',
            'zcard',
            'zcount',
            'zdiff',
            'zdiffstore',
            'zincrby',
            'zinter',
            'zinterstore',
            'zlexcount',
            'zmscore',
            'zpopmax',
            'zpopmin',
            'zrandmember',
            'zrange',
            'zrangebylex',
            'zrangebyscore',
            'zrangestore',
            'zrank',
            'zrem',
            'zremrangebylex',
            'zremrangebyrank',
            'zremrangebyscore',
            'zrevrange',
            'zrevrangebylex',
            'zrevrangebyscore',
            'zrevrank',
            'zscan',
            'zscore',
            'zunion',
            'zunionstore'
        ];
    }
}
exports.SortedSetsCommnand = SortedSetsCommnand;
//# sourceMappingURL=SortedSets.js.map
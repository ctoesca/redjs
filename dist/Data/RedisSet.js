"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisSet = void 0;
const BaseDataset_1 = require("./BaseDataset");
class RedisSet extends BaseDataset_1.BaseDataset {
    constructor(opt) {
        super(opt);
        this.data = new Set();
    }
}
exports.RedisSet = RedisSet;
//# sourceMappingURL=RedisSet.js.map
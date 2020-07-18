"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDataset = void 0;
const EventEmitter = require("events");
class BaseDataset extends EventEmitter {
    constructor(opt) {
        super();
    }
    getCommandsNames() {
        return [];
    }
}
exports.BaseDataset = BaseDataset;
//# sourceMappingURL=BaseDataset.js.map
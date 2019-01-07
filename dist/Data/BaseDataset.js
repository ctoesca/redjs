"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
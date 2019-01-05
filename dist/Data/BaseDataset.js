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
    checkArgCount(cmd, args, expected) {
        if (args.length !== expected) {
            throw new Error('ERR wrong number of arguments for \'' + cmd + '\' command');
        }
    }
    checkMinArgCount(cmd, args, expected) {
        if (args.length < expected) {
            throw new Error('ERR wrong number of arguments for \'' + cmd + '\' command');
        }
    }
}
exports.BaseDataset = BaseDataset;
//# sourceMappingURL=BaseDataset.js.map
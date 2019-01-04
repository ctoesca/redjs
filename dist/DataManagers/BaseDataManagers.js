"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = require("../utils/Timer");
const bunyan = require("bunyan");
const EventEmitter = require("events");
class BaseDataManagers extends EventEmitter {
    constructor(opt) {
        super();
        this.config = null;
        this.logger = null;
        this.mainTimer = null;
        this.data = {};
        this.config = opt;
        this.server = opt.server;
        let constructor = this.constructor;
        this.logger = bunyan.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.mainTimer = new Timer_1.Timer({ delay: 10000 });
        this.mainTimer.on(Timer_1.Timer.ON_TIMER, this.onTimer.bind(this));
    }
    static getCommandsNames() {
        return [];
    }
    getCommandsNames() {
        return BaseDataManagers.getCommandsNames();
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
    createNewKey(key) {
        this.data[key] = {};
        return this.data[key];
    }
    getDataset(key) {
        let r = null;
        if (typeof this.data[key] !== 'undefined') {
            r = this.data[key];
        }
        return r;
    }
    getOrCreate(key) {
        let r = this.getDataset(key);
        if (r == null) {
            r = this.createNewKey(key);
        }
        return r;
    }
    onTimer() {
    }
}
exports.BaseDataManagers = BaseDataManagers;
//# sourceMappingURL=BaseDataManagers.js.map
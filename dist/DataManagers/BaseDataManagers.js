"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = require("../utils/Timer");
const bunyan = require("bunyan");
const EventEmitter = require("events");
const minimatch = require("minimatch");
class BaseDataManagers extends EventEmitter {
    constructor(opt) {
        super();
        this.config = null;
        this.db = null;
        this.logger = null;
        this.mainTimer = null;
        this.data = {};
        this.server = opt.server;
        this.db = opt.db;
        let constructor = this.constructor;
        this.logger = bunyan.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.mainTimer = new Timer_1.Timer({ delay: 10000 });
        this.mainTimer.on(Timer_1.Timer.ON_TIMER, this.onTimer.bind(this));
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
    createNewKey(key) {
        return this.db.createNewKey(key, {});
    }
    getDataset(key) {
        return this.db.getDataset(key);
    }
    getOrCreate(key) {
        let r = this.getDataset(key);
        if (!r) {
            r = this.createNewKey(key);
        }
        return r;
    }
    match(value, pattern) {
        return minimatch(value, pattern);
    }
    onTimer() {
    }
}
exports.BaseDataManagers = BaseDataManagers;
//# sourceMappingURL=BaseDataManagers.js.map
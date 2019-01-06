"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = require("../utils/Timer");
const RedjsServer_1 = require("../RedjsServer");
const EventEmitter = require("events");
const minimatch = require("minimatch");
class AbstractCommands extends EventEmitter {
    constructor(opt) {
        super();
        this.config = null;
        this.datastore = null;
        this.logger = null;
        this.mainTimer = null;
        this.data = {};
        this.server = opt.server;
        this.datastore = opt.datastore;
        let constructor = this.constructor;
        this.logger = RedjsServer_1.RedjsServer.createLogger({ name: constructor.name });
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
    createNewKey(db, key) {
        return db.createNewKey(key, {});
    }
    getDataset(db, key) {
        return db.getDataset(key);
    }
    getOrCreate(db, key) {
        let r = this.getDataset(db, key);
        if (!r) {
            r = this.createNewKey(db, key);
        }
        return r;
    }
    match(value, pattern) {
        return minimatch(value, pattern);
    }
    onTimer() {
    }
}
exports.AbstractCommands = AbstractCommands;
//# sourceMappingURL=AbstractCommands.js.map
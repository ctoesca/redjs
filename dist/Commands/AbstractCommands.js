"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCommands = void 0;
const utils = require("../utils");
const RedjsServer_1 = require("../RedjsServer");
const EventEmitter = require("events");
const minimatch = require("minimatch");
const RedisError_1 = require("../Errors/RedisError");
class AbstractCommands extends EventEmitter {
    constructor(opt) {
        super();
        this.config = null;
        this.datastore = null;
        this.logger = null;
        this.mainTimer = null;
        this.server = opt.server;
        this.datastore = opt.datastore;
        let constructor = this.constructor;
        this.logger = RedjsServer_1.RedjsServer.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
    }
    destroy() {
        this.removeAllListeners();
    }
    getCommandsNames() {
        return [];
    }
    getNotImplementedCommands() {
        return [];
    }
    checkType(obj, type) {
        if (obj && !(obj instanceof type)) {
            throw new RedisError_1.RedisError('WRONGTYPE Operation against a key holding the wrong kind of value');
        }
    }
    checkArgCount(cmd, args, valueOrMin, max = -1) {
        if (arguments.length === 3) {
            if (args.length !== valueOrMin) {
                throw new RedisError_1.RedisError('ERR wrong number of arguments for \'' + cmd + '\' command');
            }
        }
        else if ((args.length < valueOrMin) || ((args.length > max) && (max > -1))) {
            throw new RedisError_1.RedisError('ERR wrong number of arguments for \'' + cmd + '\' command');
        }
    }
    checkInt(v) {
        if (!utils.isInt(v)) {
            throw new RedisError_1.RedisError('ERR value is not an integer or out of range');
        }
    }
    createNewKey(db, key) {
        throw new RedisError_1.RedisError('ERR abstract method');
    }
    getDataset(db, key) {
        return db.getDataset(key);
    }
    getDatasets(db, ...keys) {
        let r = [];
        for (let key of keys) {
            let ds = db.getDataset(key);
            if (ds) {
                r.push(ds);
            }
        }
        return r;
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
}
exports.AbstractCommands = AbstractCommands;
//# sourceMappingURL=AbstractCommands.js.map
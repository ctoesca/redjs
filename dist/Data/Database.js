"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const RedjsServer_1 = require("../RedjsServer");
const EventEmitter = require("events");
class Database extends EventEmitter {
    constructor(opt) {
        super();
        this.keys = new Map();
        this.config = null;
        this.server = null;
        this.logger = null;
        this.mainTimer = null;
        this.datastore = null;
        this.index = 0;
        this.config = opt;
        this.server = opt.server;
        this.datastore = opt.datastore;
        this.index = opt.index;
        let constructor = this.constructor;
        this.logger = RedjsServer_1.RedjsServer.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
    }
    getIndex() {
        return this.index;
    }
    clear() {
        return this.keys.clear();
    }
    createNewKey(key, object) {
        this.keys.set(key, object);
        return object;
    }
    getDataset(key) {
        return this.keys.get(key);
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map
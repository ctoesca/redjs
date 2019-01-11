"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("./Database");
const RedjsServer_1 = require("../RedjsServer");
const EventEmitter = require("events");
const utils = require("../utils");
class Datastore extends EventEmitter {
    constructor(opt) {
        super();
        this.config = null;
        this.server = null;
        this.logger = null;
        this.mainTimer = null;
        this.databases = [];
        this.config = opt;
        this.server = opt.server;
        let constructor = this.constructor;
        this.logger = RedjsServer_1.RedjsServer.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        for (let i = 0; i < 10; i++) {
            this.databases.push(new Database_1.Database({
                server: this.server,
                datastore: this,
                index: i
            }));
        }
    }
    getDb(index = 0) {
        if (!utils.isInt(index) || (index >= this.databases.length)) {
            throw 'ERR value is not an integer or out of range';
        }
        return this.databases[index];
    }
    clear() {
        for (let db of this.databases) {
            db.clear();
        }
    }
}
exports.Datastore = Datastore;
//# sourceMappingURL=Datastore.js.map
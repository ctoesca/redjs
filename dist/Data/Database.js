"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const RedjsServer_1 = require("../RedjsServer");
const EventEmitter = require("events");
const fs = require('fs-extra');
const HashDataset_1 = require("./HashDataset");
const ListDataset_1 = require("./ListDataset");
const SetDataset_1 = require("./SetDataset");
const StringsDataset_1 = require("./StringsDataset");
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
    createHashDataset(key) {
        let r = new HashDataset_1.HashDataset();
        this.keys.set(key, r);
        return r;
    }
    createListDataset(key) {
        let r = new ListDataset_1.ListDataset();
        this.keys.set(key, r);
        return r;
    }
    createSetDataset(key) {
        let r = new SetDataset_1.SetDataset();
        this.keys.set(key, r);
        return r;
    }
    createStringsDataset(key) {
        let r = new StringsDataset_1.StringsDataset();
        this.keys.set(key, r);
        return r;
    }
    getDataset(key) {
        return this.keys.get(key);
    }
    save(path) {
        let data = {};
        this.keys.forEach((value, key, index) => {
            data[key] = value;
            this.logger.error('value', value);
        });
        fs.writeFileSync(path, JSON.stringify(data, null, 4));
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map
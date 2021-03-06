"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = require("../utils/Timer");
const EventEmitter = require("events");
const bunyan = require("bunyan");
class Database extends EventEmitter {
    constructor(opt) {
        super();
        this.config = null;
        this.server = null;
        this.logger = null;
        this.mainTimer = null;
        this.keys = new Map();
        this.config = opt;
        this.server = opt.server;
        let constructor = this.constructor;
        this.logger = bunyan.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.mainTimer = new Timer_1.Timer({ delay: 10000 });
        this.mainTimer.on(Timer_1.Timer.ON_TIMER, this.onTimer.bind(this));
    }
    createNewKey(key, object) {
        return this.keys.set(key, object);
    }
    getDataset(key) {
        return this.keys.get(key);
    }
    onTimer() {
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map
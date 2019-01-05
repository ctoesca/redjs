"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = require("../utils/Timer");
const Database_1 = require("./Database");
const EventEmitter = require("events");
const bunyan = require("bunyan");
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
        this.logger = bunyan.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.mainTimer = new Timer_1.Timer({ delay: 10000 });
        this.mainTimer.on(Timer_1.Timer.ON_TIMER, this.onTimer.bind(this));
        for (let i = 0; i < 10; i++) {
            this.databases.push(new Database_1.Database({
                server: this.server,
                datastore: this
            }));
        }
    }
    getDb(index = 0) {
        return this.databases[index];
    }
    onTimer() {
    }
}
exports.Datastore = Datastore;
//# sourceMappingURL=Datastore.js.map
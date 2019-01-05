"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = require("./utils/Timer");
const EventEmitter = require("events");
const bunyan = require("bunyan");
const Keys_1 = require("./DataManagers/Keys");
const Hashes_1 = require("./DataManagers/Hashes");
const PubSub_1 = require("./DataManagers/PubSub");
const Lists_1 = require("./DataManagers/Lists");
const Sets_1 = require("./DataManagers/Sets");
const SortedSets_1 = require("./DataManagers/SortedSets");
class DB extends EventEmitter {
    constructor(opt) {
        super();
        this.config = null;
        this.server = null;
        this.logger = null;
        this.mainTimer = null;
        this.commands = {};
        this.hashes = null;
        this.keys = null;
        this.pubsub = null;
        this.sets = null;
        this.sortedSets = null;
        this.lists = null;
        this.config = opt;
        this.server = opt.server;
        let constructor = this.constructor;
        this.logger = bunyan.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.mainTimer = new Timer_1.Timer({ delay: 10000 });
        this.mainTimer.on(Timer_1.Timer.ON_TIMER, this.onTimer.bind(this));
        this.commands = {};
        this.hashes = new Hashes_1.Hashes({
            server: this.server,
            db: this
        });
        this.addComands(this.hashes);
        this.keys = new Keys_1.Keys({
            server: this.server,
            db: this
        });
        this.addComands(this.keys);
        this.pubsub = new PubSub_1.PubSub({
            server: this.server,
            db: this
        });
        this.addComands(this.pubsub);
        this.lists = new Lists_1.Lists({
            server: this.server,
            db: this
        });
        this.addComands(this.lists);
        this.sets = new Sets_1.Sets({
            server: this.server,
            db: this
        });
        this.addComands(this.sets);
        this.sortedSets = new SortedSets_1.SortedSets({
            server: this.server,
            db: this
        });
        this.addComands(this.sortedSets);
    }
    execCommand(cmd, conn, ...args) {
        if (this.commands[cmd]) {
            let command = this.commands[cmd];
            if (command.manager[cmd]) {
                return command.manager[cmd](conn, ...args);
            }
            else {
                throw 'ERR \'' + cmd + '\' command is not implemented';
            }
        }
        else if (typeof this[cmd] === 'function') {
            return this[cmd](conn, ...args);
        }
        else {
            throw 'ERR Unknown command: \'' + cmd + '\'';
        }
    }
    addComands(manager) {
        let commandsNames = manager.getCommandsNames();
        for (let i = 0; i < commandsNames.length; i++) {
            let commandName = commandsNames[i].toLowerCase();
            this.commands[commandName] = {
                manager: manager
            };
        }
    }
    onTimer() {
    }
}
exports.DB = DB;
//# sourceMappingURL=DB.js.map
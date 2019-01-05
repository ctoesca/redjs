"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = require("./utils/Timer");
const EventEmitter = require("events");
const bunyan = require("bunyan");
const Keys_1 = require("./Commands/Keys");
const Hashes_1 = require("./Commands/Hashes");
const PubSub_1 = require("./Commands/PubSub");
const Lists_1 = require("./Commands/Lists");
const Sets_1 = require("./Commands/Sets");
const SortedSets_1 = require("./Commands/SortedSets");
const ServerCommands_1 = require("./Commands/ServerCommands");
const ConnectionCommands_1 = require("./Commands/ConnectionCommands");
const StringsCommands_1 = require("./Commands/StringsCommands");
class Commander extends EventEmitter {
    constructor(opt) {
        super();
        this.config = null;
        this.server = null;
        this.datastore = null;
        this.logger = null;
        this.mainTimer = null;
        this.commands = {};
        this.hashes = null;
        this.keys = null;
        this.pubsub = null;
        this.sets = null;
        this.sortedSets = null;
        this.lists = null;
        this.stringsCommands = null;
        this.connectionCommands = null;
        this.serverCommands = null;
        this.server = opt.server;
        this.datastore = opt.datastore;
        let constructor = this.constructor;
        this.logger = bunyan.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.mainTimer = new Timer_1.Timer({ delay: 10000 });
        this.mainTimer.on(Timer_1.Timer.ON_TIMER, this.onTimer.bind(this));
        this.commands = {};
        this.hashes = new Hashes_1.Hashes({
            server: this.server,
            datastore: this.datastore
        });
        this.addComands(this.hashes);
        this.keys = new Keys_1.Keys({
            server: this.server,
            datastore: this.datastore
        });
        this.addComands(this.keys);
        this.pubsub = new PubSub_1.PubSub({
            server: this.server,
            datastore: this.datastore
        });
        this.addComands(this.pubsub);
        this.lists = new Lists_1.Lists({
            server: this.server,
            datastore: this.datastore
        });
        this.addComands(this.lists);
        this.sets = new Sets_1.Sets({
            server: this.server,
            datastore: this.datastore
        });
        this.addComands(this.sets);
        this.sortedSets = new SortedSets_1.SortedSets({
            server: this.server,
            datastore: this.datastore
        });
        this.addComands(this.sortedSets);
        this.serverCommands = new ServerCommands_1.ServerCommands({
            server: this.server,
            datastore: this.datastore
        });
        this.addComands(this.serverCommands);
        this.connectionCommands = new ConnectionCommands_1.ConnectionCommands({
            server: this.server,
            datastore: this.datastore
        });
        this.addComands(this.connectionCommands);
        this.stringsCommands = new StringsCommands_1.StringsCommands({
            server: this.server,
            datastore: this.datastore
        });
        this.addComands(this.stringsCommands);
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
exports.Commander = Commander;
//# sourceMappingURL=Commander.js.map
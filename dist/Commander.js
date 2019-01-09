"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const RedjsServer_1 = require("./RedjsServer");
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
        this.logger = RedjsServer_1.RedjsServer.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.commands = {};
        let commandsManagers = [
            { name: 'hashes', clazz: Hashes_1.Hashes },
            { name: 'keys', clazz: Keys_1.Keys },
            { name: 'pubsub', clazz: PubSub_1.PubSub },
            { name: 'lists', clazz: Lists_1.Lists },
            { name: 'sets', clazz: Sets_1.Sets },
            { name: 'sortedSets', clazz: SortedSets_1.SortedSets },
            { name: 'serverCommands', clazz: ServerCommands_1.ServerCommands },
            { name: 'connectionCommands', clazz: ConnectionCommands_1.ConnectionCommands },
            { name: 'stringsCommands', clazz: StringsCommands_1.StringsCommands }
        ];
        for (let commandManager of commandsManagers) {
            this[commandManager.name] = new commandManager.clazz({
                server: this.server,
                datastore: this.datastore
            });
            this.addComands(this[commandManager.name]);
        }
    }
    execCommand(cmd, conn, ...args) {
        if (this.commands[cmd]) {
            let command = this.commands[cmd];
            if (command.manager[cmd]) {
                command.manager.checkArgs(cmd, ...args);
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
}
exports.Commander = Commander;
//# sourceMappingURL=Commander.js.map
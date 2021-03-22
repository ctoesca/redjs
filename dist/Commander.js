"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commander = void 0;
const EventEmitter = require("events");
const RedjsServer_1 = require("./RedjsServer");
const KeysCommands_1 = require("./Commands/KeysCommands");
const HashesCommands_1 = require("./Commands/HashesCommands");
const PubSubCommands_1 = require("./Commands/PubSubCommands");
const ListsCommands_1 = require("./Commands/ListsCommands");
const SetsCommands_1 = require("./Commands/SetsCommands");
const SortedSetsCommnands_1 = require("./Commands/SortedSetsCommnands");
const ServerCommands_1 = require("./Commands/ServerCommands");
const ConnectionCommands_1 = require("./Commands/ConnectionCommands");
const StringsCommands_1 = require("./Commands/StringsCommands");
const TransactionsCommand_1 = require("./Commands/TransactionsCommand");
const ClusterCommands_1 = require("./Commands/ClusterCommands");
const GeoCommands_1 = require("./Commands/GeoCommands");
const HyperLogLogCommands_1 = require("./Commands/HyperLogLogCommands");
const ScriptingCommands_1 = require("./Commands/ScriptingCommands");
const StreamsCommands_1 = require("./Commands/StreamsCommands");
const RedisError_1 = require("./Errors/RedisError");
const NotImplementedError_1 = require("./Errors/NotImplementedError");
class Commander extends EventEmitter {
    constructor(opt) {
        super();
        this.config = null;
        this.server = null;
        this.datastore = null;
        this.logger = null;
        this.mainTimer = null;
        this.commands = {};
        this.hashesCommands = null;
        this.keysCommands = null;
        this.pubsubCommands = null;
        this.setsCommands = null;
        this.sortedSetsCommnand = null;
        this.listsCommands = null;
        this.stringsCommands = null;
        this.connectionCommands = null;
        this.serverCommands = null;
        this.transactionsCommands = null;
        this.clusterCommands = null;
        this.geoCommands = null;
        this.hyperLogLogCommands = null;
        this.scriptingCommands = null;
        this.streamsCommands = null;
        this.sortedSetsCommnands = null;
        this.server = opt.server;
        this.datastore = opt.datastore;
        let constructor = this.constructor;
        this.logger = RedjsServer_1.RedjsServer.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.commands = {};
        let commandsManagers = [
            { name: 'hashesCommands', clazz: HashesCommands_1.HashesCommands },
            { name: 'keysCommands', clazz: KeysCommands_1.KeysCommands },
            { name: 'pubsubCommands', clazz: PubSubCommands_1.PubSubCommands },
            { name: 'listsCommands', clazz: ListsCommands_1.ListsCommands },
            { name: 'setsCommands', clazz: SetsCommands_1.SetsCommands },
            { name: 'sortedSetsCommnands', clazz: SortedSetsCommnands_1.SortedSetsCommnands },
            { name: 'serverCommands', clazz: ServerCommands_1.ServerCommands },
            { name: 'connectionCommands', clazz: ConnectionCommands_1.ConnectionCommands },
            { name: 'stringsCommands', clazz: StringsCommands_1.StringsCommands },
            { name: 'transactionsCommands', clazz: TransactionsCommand_1.TransactionsCommand },
            { name: 'clusterCommands', clazz: ClusterCommands_1.ClusterCommands },
            { name: 'geoCommands', clazz: GeoCommands_1.GeoCommands },
            { name: 'hyperLogLogCommands', clazz: HyperLogLogCommands_1.HyperLogLogCommands },
            { name: 'scriptingCommands', clazz: ScriptingCommands_1.ScriptingCommands },
            { name: 'streamsCommands', clazz: StreamsCommands_1.StreamsCommands }
        ];
        for (let commandManager of commandsManagers) {
            this[commandManager.name] = new commandManager.clazz({
                server: this.server,
                datastore: this.datastore
            });
            this.addCommands(this[commandManager.name]);
        }
    }
    execCommand(conn, checkOnly = false, cmd, ...args) {
        if (this.commands[cmd]) {
            let command = this.commands[cmd];
            if (command.manager[cmd]) {
                command.manager['check_' + cmd](conn, ...args);
                if (!checkOnly) {
                    return command.manager[cmd](conn, ...args);
                }
            }
            else {
                throw new NotImplementedError_1.NotImplementedError(cmd);
            }
        }
        else {
            throw new RedisError_1.RedisError('ERR Unknown command: \'' + cmd + '\'');
        }
    }
    addCommands(manager) {
        let commandsNames = manager.getCommandsNames();
        let notImplementedCommands = manager.getNotImplementedCommands();
        for (let i = 0; i < commandsNames.length; i++) {
            let commandName = commandsNames[i];
            if (!manager[commandName]) {
                manager[commandName] = (conn) => {
                    throw new NotImplementedError_1.NotImplementedError(commandName);
                };
            }
            this.commands[commandName] = {
                manager: manager
            };
        }
        for (let i = 0; i < notImplementedCommands.length; i++) {
            let commandName = notImplementedCommands[i];
            manager[commandName] = (conn) => {
                throw new NotImplementedError_1.NotImplementedError(commandName);
            };
            this.commands[commandName] = {
                manager: manager
            };
        }
    }
}
exports.Commander = Commander;
//# sourceMappingURL=Commander.js.map
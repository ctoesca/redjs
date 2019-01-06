"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Datastore_1 = require("./Data/Datastore");
const Commander_1 = require("./Commander");
const Connection_1 = require("./Connection");
const utils = require("./utils");
const bunyan = require("bunyan");
const Promise = require("bluebird");
const EventEmitter = require("events");
const _ = require("lodash");
const net = require("net");
class RedjsServer extends EventEmitter {
    constructor(...opt) {
        super();
        this.server = null;
        this.started = false;
        this.lastError = null;
        this.connections = new Map();
        this.datastore = null;
        this.logger = null;
        this._workers = {};
        this.monitoredConnections = new Map();
        this.mainTimer = null;
        this.commander = null;
        this.options = null;
        let constructor = this.constructor;
        this.logger = RedjsServer.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.parseOptions(...opt);
        this.datastore = new Datastore_1.Datastore({ server: this });
        this.commander = new Commander_1.Commander({ server: this, datastore: this.datastore });
    }
    static createLogger(opt) {
        return bunyan.createLogger({ name: opt.name });
    }
    static getDefaultOptions() {
        return {
            port: 6969,
            host: 'localhost'
        };
    }
    broadcast(channel, msg, connections = null) {
        let r = 0;
        if (!connections) {
            connections = this.connections;
        }
        connections.forEach((connection, connId) => {
            connection.writeChannelMessage(channel, msg);
            r++;
        });
        return r;
    }
    getConnectionsCount() {
        return this.connections.size;
    }
    getMonitoredConnectionsCount() {
        return this.monitoredConnections.size;
    }
    start() {
        if (this.started) {
            return;
        }
        this.createServer();
        this.started = true;
    }
    parseOptions(...args) {
        this.options = {};
        for (let i = 0; i < args.length; ++i) {
            let arg = args[i];
            if (arg === null || typeof arg === 'undefined') {
                continue;
            }
            if (typeof arg === 'object') {
                _.defaults(this.options, arg);
            }
            else if (typeof arg === 'string') {
                _.defaults(this.options, utils.parseURL(arg));
            }
            else if (typeof arg === 'number') {
                this.options.port = arg;
            }
            else {
                throw new Error('Invalid argument ' + arg);
            }
        }
        _.defaults(this.options, RedjsServer.getDefaultOptions());
    }
    ;
    logConnectionsCount() {
        this.logger.debug('Connections count: ' + this.getConnectionsCount());
    }
    onConnectionClosed(conn) {
        this.emit('connection-close', conn);
        if (this.connections.has(conn.id)) {
            this.connections.delete(conn.id);
        }
        this.monitoredConnections.delete(conn.id);
        this.logConnectionsCount();
        if (this.getMonitoredConnectionsCount() === 0) {
            this.connections.forEach((connection, connId) => {
                connection.removeAllListeners('command');
            });
        }
    }
    onMonitoredConnection(conn) {
        this.monitoredConnections.set(conn.id, conn);
        this.connections.forEach((connection, connId) => {
            connection.on('command', (sentBy, cmd, ...args) => {
                this.onCommand(sentBy, cmd, ...args);
            });
        });
    }
    onCommand(conn, cmd, ...args) {
        let timestamp = new Date().getTime() / 1000;
        let data = timestamp + ' [0 ' + conn.getRemoteAddressPort() + '] \'' + cmd + '\'';
        for (let arg of args) {
            data += ' "' + arg + '"';
        }
        this.monitoredConnections.forEach((connection, connId) => {
            connection.writeMonitorData(data);
        });
    }
    createServer() {
        return new Promise((resolve, reject) => {
            let HOST = this.options.host;
            let PORT = this.options.port;
            this.server = net.createServer((sock) => {
                let conn = new Connection_1.Connection(this, sock, this.commander);
                conn.on('close', () => {
                    this.onConnectionClosed(conn);
                });
                conn.on('monitor', () => {
                    this.onMonitoredConnection(conn);
                });
                this.connections.set(conn.id, conn);
                this.logConnectionsCount();
                if (this.getMonitoredConnectionsCount() > 0) {
                    conn.on('command', (sentBy, cmd, ...args) => {
                        this.onCommand(sentBy, cmd, ...args);
                    });
                }
            });
            this.server.on('error', (e) => {
                this.logger.error(e.toString());
                reject(e);
                process.exit(1);
            });
            this.server.listen(PORT, HOST, () => {
                this.logger.info('Server listening on ' + HOST + ':' + PORT);
                resolve();
            });
        });
    }
}
exports.RedjsServer = RedjsServer;
//# sourceMappingURL=RedjsServer.js.map
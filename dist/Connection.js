"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RedjsServer_1 = require("./RedjsServer");
const Parser_1 = require("./utils/Parser");
const EventEmitter = require("events");
const uuid = require("uuid/v4");
class Connection extends EventEmitter {
    constructor(server, sock, commander) {
        super();
        this.id = null;
        this.lastError = null;
        this.database = null;
        this.sock = null;
        this.commander = null;
        this.server = null;
        this.logger = null;
        this.mainTimer = null;
        this.parser = null;
        this.closing = false;
        this.processingData = false;
        this.onCommand = null;
        this.id = uuid();
        this.sock = sock;
        this.server = server;
        this.commander = commander;
        let constructor = this.constructor;
        this.logger = RedjsServer_1.RedjsServer.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.lastError = null;
        this.sock.on('close', () => {
            this.onSockClose();
        });
        this.sock.on('data', (data) => {
            this.onSockData(data);
        });
        this.sock.on('error', (err) => {
            if (err.code !== 'ECONNRESET') {
                this.logger.error('ERROR: ' + this.getRemoteAddressPort(), err);
            }
        });
        this.logger.debug('CONNECTED: ' + this.getRemoteAddressPort());
        this.parser = new Parser_1.Parser();
        this.setDatabase(0);
    }
    setDatabase(index) {
        this.database = this.server.datastore.getDb(index);
        return this.database;
    }
    setCommandListener(v = null) {
        this.onCommand = v;
    }
    removeCommandListener() {
        this.onCommand = null;
    }
    getCommandListener() {
        return this.onCommand;
    }
    getRemoteAddressPort() {
        return this.sock.remoteAddress + ':' + this.sock.remotePort;
    }
    writeMonitorData(data) {
        this.sock.write(this.parser.toRESP(data, 'simpleString'));
    }
    writeChannelMessage(channel, payload) {
        let data = ['message', channel, payload];
        this.sock.write(this.parser.toRESP(data));
    }
    destroy() {
        this.closing = false;
        this.processingData = false;
        this.removeCommandListener();
        this.removeAllListeners();
        this.sock.removeAllListeners();
        this.sock.destroy();
        this.sock = null;
        this.commander = null;
    }
    quit() {
        if (this.processingData) {
            this.closing = true;
        }
        else {
            this.sock.end();
        }
    }
    pause() {
        this.sock.pause();
    }
    resume() {
        this.sock.resume();
    }
    processPipelineRequest(requestData) {
        let responses = [];
        for (let data of requestData) {
            let cmd = data[0].toLowerCase();
            data.shift();
            if (this.onCommand) {
                this.onCommand(this, cmd, ...data);
            }
            let responseData = this.commander.execCommand(cmd, this, ...data);
            responses.push(responseData);
        }
        for (let i = 0; i < responses.length; i++) {
            this.sock.write(this.parser.toRESP(responses[i]));
        }
    }
    processSingleRequest(requestData) {
        let cmd = requestData[0].toLowerCase();
        requestData.shift();
        if (this.onCommand) {
            this.onCommand(this, cmd, ...requestData);
        }
        let responseData = this.commander.execCommand(cmd, this, ...requestData);
        let resp = this.parser.toRESP(responseData);
        this.sock.write(resp);
    }
    onSockData(data) {
        try {
            this.processingData = true;
            let requestData = this.parser.fromRESP(data);
            if (typeof requestData[0] === 'object') {
                this.processPipelineRequest(requestData);
            }
            else {
                this.processSingleRequest(requestData);
            }
            this.processingData = false;
        }
        catch (err) {
            if (this.lastError !== err.toString()) {
                this.lastError = err.toString();
                this.logger.error('REQUEST: ' + data.toString().replace(/\r\n/g, '\\r\\n') + ', ERROR: ', err);
            }
            this.sock.write(this.parser.toRESP(this.lastError, 'error'));
            this.processingData = false;
        }
        if (this.closing) {
            this.sock.end();
        }
    }
    onSockClose() {
        this.logger.debug('CLOSED: ' + this.getRemoteAddressPort());
        this.emit('close');
        this.destroy();
    }
}
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map
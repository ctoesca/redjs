"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const RedjsServer_1 = require("./RedjsServer");
const Parser_1 = require("./utils/Parser");
const EventEmitter = require("events");
const uuid = require("uuid/v4");
const RedisError_1 = require("./Errors/RedisError");
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
        this.inTransaction = false;
        this.transactionCommands = [];
        this.transactionErrors = [];
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
    beginTransaction() {
        if (this.inTransaction) {
            throw new RedisError_1.RedisError('ERR MULTI calls can not be nested');
        }
        this.inTransaction = true;
        this.transactionCommands = [];
    }
    commitTransaction() {
        if (!this.inTransaction) {
            throw new RedisError_1.RedisError('ERR EXEC without MULTI');
        }
        if (this.transactionErrors.length > 0) {
            this.cancelTransaction(true);
            throw new RedisError_1.RedisError('EXECABORT Transaction discarded because of previous errors.');
        }
        let responses = [];
        for (let command of this.transactionCommands) {
            try {
                let responseData = this.execCommand(command.name, command.args, true);
                responses.push(responseData);
            }
            catch (err) {
                console.log('exec command error ' + err.toString());
                responses.push(err);
            }
        }
        this.inTransaction = false;
        this.transactionCommands = [];
        this.transactionErrors = [];
        return responses;
    }
    cancelTransaction(force = false) {
        if (!force && !this.inTransaction) {
            throw new RedisError_1.RedisError('ERR DISCARD without MULTI');
        }
        this.inTransaction = false;
        this.transactionCommands = [];
        this.transactionErrors = [];
    }
    addTransactionCommand(name, args) {
        try {
            this.commander.execCommand(this, true, name, ...args);
        }
        catch (err) {
            this.logger.error('addTransactionCommand', err);
            this.transactionErrors.push(err);
            throw err;
        }
        finally {
            this.transactionCommands.push({
                name: name,
                args: args
            });
        }
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
    execCommand(cmd, args, force = false) {
        if (this.onCommand) {
            this.onCommand(this, cmd, ...args);
        }
        let resp;
        if (!force && this.inTransaction && (cmd !== 'exec') && (cmd !== 'multi') && (cmd !== 'discard')) {
            this.addTransactionCommand(cmd, args);
            resp = 'QUEUED';
        }
        else {
            let responseData = this.commander.execCommand(this, false, cmd, ...args);
            resp = responseData;
        }
        return resp;
    }
    processPipelineRequest(requestData) {
        let responses = [];
        for (let data of requestData) {
            let resp;
            let cmd = data[0].toLowerCase();
            data.shift();
            try {
                resp = this.execCommand(cmd, data);
            }
            catch (err) {
                resp = err;
            }
            responses.push(resp);
            resp = this.parser.toRESP(resp);
            this.sock.write(resp);
        }
    }
    processSingleRequest(requestData, sendResponse = true) {
        let cmd = requestData[0].toLowerCase();
        requestData.shift();
        let resp = this.parser.toRESP(this.execCommand(cmd, requestData));
        this.sock.write(resp);
    }
    onSockData(data) {
        let requestData;
        try {
            this.processingData = true;
            requestData = this.parser.fromRESP(data);
            if (typeof requestData[0] === 'object') {
                this.processPipelineRequest(requestData);
            }
            else {
                this.processSingleRequest(requestData);
            }
        }
        catch (err) {
            this.lastError = err;
            this.logger.error('REQUEST: ', requestData);
            this.logger.error('RESPONSE: ', err.toString());
            let resp = this.parser.toRESP(err);
            this.sock.write(resp);
        }
        finally {
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Timer_1 = require("./utils/Timer");
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
        this.id = uuid();
        this.sock = sock;
        this.server = server;
        this.commander = commander;
        this.database = this.server.datastore.getDb(0);
        let constructor = this.constructor;
        this.logger = RedjsServer_1.RedjsServer.createLogger({ name: constructor.name });
        this.logger.debug(constructor.name + ' created');
        this.mainTimer = new Timer_1.Timer({ delay: 10000 });
        this.mainTimer.on(Timer_1.Timer.ON_TIMER, this.onTimer.bind(this));
        this.mainTimer.start();
        this.lastError = null;
        this.sock.on('close', () => {
            this.onSockClose();
        });
        this.sock.on('data', (data) => {
            this.onSockData(data);
        });
        this.sock.on('error', (err) => {
            this.onSockError(err);
        });
        this.logger.debug('CONNECTED: ' + this.sock.remoteAddress + ':' + this.sock.remotePort);
        this.parser = new Parser_1.Parser();
    }
    getRemoteAddress() {
        return this.sock.remoteAddress;
    }
    getRemotePort() {
        return this.sock.remotePort;
    }
    writeMonitorData(data) {
        this.sock.write(this.parser.toRESP(data, 'simpleString'));
    }
    writeChannelMessage(channel, payload) {
        let data = ['message', channel, payload];
        this.sock.write(this.parser.toRESP(data));
    }
    destroy() {
        this.mainTimer.destroy();
        this.removeAllListeners();
        this.sock.removeAllListeners();
        this.sock = null;
        this.commander = null;
    }
    pause() {
        this.sock.pause();
    }
    resume() {
        this.sock.resume();
    }
    onSockData(data) {
        this.logger.debug('onSockData ' + this.sock.remoteAddress + ': ' + data);
        try {
            let requestData = this.parser.fromRESP(data);
            let commands = [];
            if (typeof requestData[0] === 'object') {
                let responses = [];
                for (let i = 0; i < requestData.length; i++) {
                    let cmd = requestData[i][0].toLowerCase();
                    requestData[i].shift();
                    if (this.listenerCount('command') > 0) {
                        this.emit('command', this, cmd, ...requestData[i]);
                    }
                    let responseData = this.commander.execCommand(cmd, this, ...requestData[i]);
                    responses.push(responseData);
                }
                for (let i = 0; i < responses.length; i++) {
                    this.sock.write(this.parser.toRESP(responses[i]));
                }
            }
            else {
                let cmd = requestData[0].toLowerCase();
                requestData.shift();
                if (this.listenerCount('command') > 0) {
                    this.emit('command', this, cmd, ...requestData);
                }
                let responseData = this.commander.execCommand(cmd, this, ...requestData);
                let resp = this.parser.toRESP(responseData);
                this.sock.write(resp);
            }
        }
        catch (err) {
            if (this.lastError !== err.toString()) {
                this.lastError = err.toString();
                this.logger.error('REQUEST: ' + data.toString().replace(/\r\n/g, '\\r\\n') + ', ERROR: ', err);
            }
            let resp = this.parser.toRESP(err.toString(), 'error');
            this.sock.write(resp);
        }
    }
    onSockError(err) {
        if (err.code !== 'ECONNRESET') {
            this.logger.error('ERROR: ' + this.sock.remoteAddress + ' ' + this.sock.remotePort, err);
        }
    }
    onSockClose() {
        this.logger.debug('CLOSED: ' + this.sock.remoteAddress + ' ' + this.sock.remotePort);
        this.emit('close');
    }
    onTimer() {
    }
}
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map
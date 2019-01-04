"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseDataManagers_1 = require("./BaseDataManagers");
const minimatch = require("minimatch");
class PubSub extends BaseDataManagers_1.BaseDataManagers {
    constructor(opt) {
        super(opt);
        this.channels = new Map();
        this.patternsSubscriptions = new Map();
    }
    static getCommandsNames() {
        return ['unsubscribe', 'subscribe', 'publish', 'PSUBSCRIBE', 'PUBSUB', 'PUNSUBSCRIBE'];
    }
    getSubscriptionsCount(conn) {
        let r = 0;
        this.channels.forEach((connections, channel) => {
            if (connections.has(conn.id)) {
                r++;
            }
        });
        this.patternsSubscriptions.forEach((connections, pattern) => {
            if (connections.has(conn.id)) {
                r++;
            }
        });
        return r;
    }
    subscribe(conn, ...channels) {
        this.checkMinArgCount('subscribe', arguments, 2);
        let r = ['subscribe'];
        if ((channels.length < 1) || (channels[0] === undefined)) {
            throw 'ERR wrong number of arguments for \'psubscribe\' command';
        }
        else {
            for (let i = 0; i < channels.length; i++) {
                let channel = channels[i];
                let channelMap;
                if (!this.channels.has(channel)) {
                    channelMap = new Map();
                    this.channels.set(channel, channelMap);
                }
                else {
                    channelMap = this.channels.get(channel);
                }
                channelMap.set(conn.id, conn);
                r.push(channel);
                conn.on('close', () => {
                    this.onConnectionClosed(conn);
                });
            }
        }
        r.push(this.getSubscriptionsCount(conn));
        return r;
    }
    psubscribe(conn, ...patterns) {
        let r = ['psubscribe'];
        this.checkMinArgCount('psubscribe', arguments, 2);
        if ((patterns.length < 1) || (patterns[0] === undefined)) {
            throw 'ERR wrong number of arguments for \'psubscribe\' command';
        }
        else {
            for (let i = 0; i < patterns.length; i++) {
                let pattern = patterns[i];
                let channelMap;
                if (!this.patternsSubscriptions.has(pattern)) {
                    channelMap = new Map();
                    this.patternsSubscriptions.set(pattern, channelMap);
                }
                else {
                    channelMap = this.patternsSubscriptions.get(pattern);
                }
                channelMap.set(conn.id, conn);
                r.push(pattern);
                conn.on('close', () => {
                    this.onConnectionClosed(conn);
                });
            }
        }
        r.push(this.getSubscriptionsCount(conn));
        return r;
    }
    unsubscribe(conn, ...channels) {
        let r = ['unsubscribe'];
        this.checkMinArgCount('unsubscribe', arguments, 2);
        if ((channels.length === 0) || (channels[0] === undefined)) {
            this.channels.forEach((connections, channel) => {
                if (connections.has(conn.id)) {
                    connections.delete(conn.id);
                    r.push(channel);
                }
            });
        }
        else {
            for (let i = 0; i < channels.length; i++) {
                let channelMap = this.channels.get(channels[i]);
                if (typeof channelMap !== 'undefined') {
                    channelMap.delete(conn.id);
                    r.push(channels[i]);
                }
            }
        }
        r.push(this.getSubscriptionsCount(conn));
        return r;
    }
    punsubscribe(conn, ...patterns) {
        let r = ['punsubscribe'];
        this.checkMinArgCount('punsubscribe', arguments, 2);
        if ((patterns.length === 0) || (patterns[0] === undefined)) {
            this.patternsSubscriptions.forEach((connections, channel) => {
                if (connections.has(conn.id)) {
                    connections.delete(conn.id);
                    r.push(channel);
                }
            });
        }
        else {
            for (let i = 0; i < patterns.length; i++) {
                let channelMap = this.patternsSubscriptions.get(patterns[i]);
                if (typeof channelMap !== 'undefined') {
                    channelMap.delete(conn.id);
                    r.push(patterns[i]);
                }
            }
        }
        r.push(this.getSubscriptionsCount(conn));
        return r;
    }
    publish(conn, channel, message) {
        this.checkArgCount('publish', arguments, 3);
        let r = 0;
        let destConnections;
        if (this.channels.has('channel')) {
            destConnections = this.channels.get('channel');
        }
        else {
            destConnections = new Map();
        }
        this.patternsSubscriptions.forEach((connections, pattern) => {
            if (this.match(channel, pattern)) {
                connections.forEach((connection, connId) => {
                    destConnections.set(connId, connection);
                });
            }
        });
        r += this.server.broadcast(channel, message, destConnections);
        return r;
    }
    onConnectionClosed(conn) {
        this.channels.forEach((connections, channel) => {
            connections.delete(conn.id);
        });
        this.patternsSubscriptions.forEach((connections, channel) => {
            connections.delete(conn.id);
        });
    }
    match(value, pattern) {
        return minimatch(value, pattern);
    }
    onTimer() {
    }
}
exports.PubSub = PubSub;
//# sourceMappingURL=PubSub.js.map
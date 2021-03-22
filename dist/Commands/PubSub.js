"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSub = void 0;
const AbstractCommands_1 = require("./AbstractCommands");
class PubSub extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
        this.channels = new Map();
        this.patternsSubscriptions = new Map();
        this._onConnectionClose = this.onConnectionClosed.bind(this);
        this.server.on('connection-close', this._onConnectionClose);
    }
    destroy() {
        this.server.removeListener('connection-close', this._onConnectionClose);
        this.channels.clear();
        this.patternsSubscriptions.clear();
        super.destroy();
    }
    getCommandsNames() {
        return ['unsubscribe', 'subscribe', 'publish', 'psubscribe', 'punsubscribe'];
    }
    getNotImplementedCommands() {
        return ['pubsub'];
    }
    getSubscriptionsCount(conn) {
        let r = 0;
        this.iterateAllSubscriptions((connections, channel, map) => {
            if (connections.has(conn.id)) {
                r++;
            }
        });
        return r;
    }
    subscribe(conn, ...channels) {
        this.checkArgCount('subscribe', arguments, 2, -1);
        let r = ['subscribe'];
        r.concat(this._subscribe(conn, this.channels, channels));
        r.push(this.getSubscriptionsCount(conn));
        return r;
    }
    psubscribe(conn, ...patterns) {
        let r = ['psubscribe'];
        this.checkArgCount('psubscribe', arguments, 2, -1);
        r.concat(this._subscribe(conn, this.patternsSubscriptions, patterns));
        r.push(this.getSubscriptionsCount(conn));
        return r;
    }
    unsubscribe(conn, ...channels) {
        let r = ['unsubscribe'];
        this.checkArgCount('punsubscribe', arguments, 2, -1);
        r = r.concat(this._unsubscribe(conn, this.channels, channels));
        r.push(this.getSubscriptionsCount(conn));
        return r;
    }
    punsubscribe(conn, ...patterns) {
        let r = ['punsubscribe'];
        this.checkArgCount('punsubscribe', arguments, 2, -1);
        r = r.concat(this._unsubscribe(conn, this.patternsSubscriptions, patterns));
        r.push(this.getSubscriptionsCount(conn));
        return r;
    }
    publish(conn, channel, message) {
        this.checkArgCount('publish', arguments, 3);
        let r = 0;
        let destConnections;
        if (this.channels.has(channel)) {
            destConnections = this.channels.get(channel);
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
    _subscribe(conn, map, channels) {
        let r = [];
        for (let channel of channels) {
            let channelMap = map.get(channel);
            if (typeof channelMap === 'undefined') {
                channelMap = new Map();
                map.set(channel, channelMap);
            }
            channelMap.set(conn.id, conn);
            r.push(channel);
        }
        return r;
    }
    iterateAllSubscriptions(cb) {
        let r = 0;
        for (let mapName of ['channels', 'patternsSubscriptions']) {
            let map = this[mapName];
            map.forEach((connections, channel) => {
                if (cb) {
                    cb(connections, channel, map);
                }
                r++;
            });
        }
        return r;
    }
    _unsubscribe(conn, map, channels) {
        let r = [];
        let channelsToRemove = [];
        map.forEach((connections, channel) => {
            if (connections.has(conn.id)) {
                if ((channels.length === 0) || (channels.indexOf(channel) >= 0)) {
                    connections.delete(conn.id);
                    r.push(channel);
                }
                if (connections.size === 0) {
                    channelsToRemove.push(channel);
                }
            }
        });
        for (let channel of channelsToRemove) {
            map.delete(channel);
        }
        return r;
    }
    onConnectionClosed(conn) {
        this.iterateAllSubscriptions((connections, channel, map) => {
            connections.delete(conn.id);
            if (connections.size === 0) {
                map.delete(channel);
            }
        });
    }
}
exports.PubSub = PubSub;
//# sourceMappingURL=PubSub.js.map
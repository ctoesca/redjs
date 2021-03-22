"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionCommands = void 0;
const AbstractCommands_1 = require("./AbstractCommands");
const RedisError_1 = require("../Errors/RedisError");
class ConnectionCommands extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['ping', 'auth', 'echo', 'quit', 'select'];
    }
    getNotImplementedCommands() {
        return [
            'client',
            'hello',
            'reset'
        ];
    }
    check_ping(conn, responseExpected = null) {
        this.checkArgCount('echo', arguments, 1, 2);
    }
    ping(conn, responseExpected = null) {
        let r = 'PONG';
        if (responseExpected) {
            r = responseExpected;
        }
        return {
            type: 'simpleString',
            value: r
        };
    }
    check_select(conn, index = 0) {
        this.checkArgCount('echo', arguments, 2);
    }
    select(conn, index = 0) {
        conn.setDatabase(index);
        return 'OK';
    }
    check_auth(conn, password) {
        this.checkArgCount('auth', arguments, 2);
    }
    auth(conn, password) {
        throw new RedisError_1.RedisError("ERR Client sent AUTH, but no password is set");
    }
    check_echo(conn, message) {
        this.checkArgCount('echo', arguments, 2);
    }
    echo(conn, message) {
        let r = message;
        return {
            type: 'simpleString',
            value: r
        };
    }
    check_quit(conn) {
        this.checkArgCount('quit', arguments, 1);
    }
    quit(conn) {
        conn.quit();
        return 'OK';
    }
}
exports.ConnectionCommands = ConnectionCommands;
//# sourceMappingURL=ConnectionCommands.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommands_1 = require("./AbstractCommands");
class ConnectionCommands extends AbstractCommands_1.AbstractCommands {
    constructor(opt) {
        super(opt);
    }
    getCommandsNames() {
        return ['ping'];
    }
    ping(conn, responseExpected = null) {
        let r = 'PONG';
        if (responseExpected) {
            r = responseExpected;
        }
        return r;
    }
}
exports.ConnectionCommands = ConnectionCommands;
//# sourceMappingURL=ConnectionCommands.js.map
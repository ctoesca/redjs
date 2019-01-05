import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
export declare class ConnectionCommands extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    ping(conn: Connection, responseExpected?: string): string;
}

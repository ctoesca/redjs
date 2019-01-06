import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
export declare class ConnectionCommands extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    ping(conn: Connection, responseExpected?: string): {
        type: string;
        value: string;
    };
    select(conn: Connection, index?: number): {
        type: string;
        value: string;
    };
    auth(conn: Connection, password: string): {
        type: string;
        value: string;
    };
    echo(conn: Connection, message: string): {
        type: string;
        value: string;
    };
}

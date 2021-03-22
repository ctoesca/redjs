import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
export declare class ConnectionCommands extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    getNotImplementedCommands(): string[];
    check_ping(conn: Connection, responseExpected?: string): void;
    ping(conn: Connection, responseExpected?: string): {
        type: string;
        value: string;
    };
    check_select(conn: Connection, index?: number): void;
    select(conn: Connection, index?: number): string;
    check_auth(conn: Connection, password: string): void;
    auth(conn: Connection, password: string): void;
    check_echo(conn: Connection, message: string): void;
    echo(conn: Connection, message: string): {
        type: string;
        value: string;
    };
    check_quit(conn: Connection): void;
    quit(conn: Connection): string;
}

import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
export declare class ServerCommands extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    flushdb(conn: Connection, async: string): {
        value: string;
        type: string;
    };
    monitor(conn: Connection): {
        value: string;
        type: string;
    };
    info(conn: Connection, section?: string): string;
}

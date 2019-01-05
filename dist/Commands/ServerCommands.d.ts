import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
export declare class ServerCommands extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    flushdb(conn: Connection, async: string): string;
    monitor(conn: Connection): string;
    info(conn: Connection): string;
}

import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
import { Database } from '../data/Database';
export declare class StringsCommands extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    strlen(conn: Connection, key: string): number;
    get(conn: Connection, key: string): any;
    set(conn: Connection, key: string, value: any, ...options: any[]): string;
    incr(conn: Connection, key: string): any;
    protected createNewKey(db: Database, key: string): any;
}

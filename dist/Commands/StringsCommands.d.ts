import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
import { Database } from '../data/Database';
import { StringsDataset } from '../Data/StringsDataset';
export declare class StringsCommands extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    getNotImplementedCommands(): string[];
    check_strlen(conn: Connection, key: string): void;
    strlen(conn: Connection, key: string): number;
    check_get(conn: Connection, key: string): void;
    get(conn: Connection, key: string): any;
    check_set(conn: Connection, key: string, value: any, ...options: any[]): void;
    set(conn: Connection, key: string, value: any, ...options: any[]): string;
    check_incr(conn: Connection, key: string): void;
    incr(conn: Connection, key: string): any;
    protected getDataset(db: Database, key: string): StringsDataset;
    protected createNewKey(db: Database, key: string): StringsDataset;
}

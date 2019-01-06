import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
import { Database } from '../data/Database';
export declare class Lists extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    lrange(conn: Connection, key: string, start: any, stop: any): any[];
    lindex(conn: Connection, key: string, index: any): any;
    linsert(conn: Connection, key: string, position: string, pivot: string, value: string): number;
    lset(conn: Connection, key: string, index: any, value: string): string;
    lpush(conn: Connection, key: string, ...values: string[]): any;
    rpush(conn: Connection, key: string, ...values: string[]): any;
    rpop(conn: Connection, key: string): any;
    lpop(conn: Connection, key: string): any;
    llen(conn: Connection, key: string): number;
    protected normalizeIndex(index: any, arr: any[]): number;
    protected getDataset(db: Database, key: string): any;
    protected createNewKey(db: Database, key: string): any;
}

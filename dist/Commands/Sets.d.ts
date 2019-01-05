import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
import { Database } from '../data/Database';
export declare class Sets extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    srem(conn: Connection, key: string, ...members: string[]): number;
    sadd(conn: Connection, key: string, ...members: string[]): number;
    smembers(conn: Connection, key: string): any[];
    protected getDataset(db: Database, key: string): any;
    protected createNewKey(db: Database, key: string): any;
    protected onTimer(): void;
}

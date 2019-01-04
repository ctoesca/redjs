import { BaseDataManagers } from './BaseDataManagers';
import { Connection } from '../Connection';
export declare class Sets extends BaseDataManagers {
    constructor(opt: any);
    static getCommandsNames(): string[];
    srem(conn: Connection, key: string, ...members: string[]): number;
    sadd(conn: Connection, key: string, ...members: string[]): number;
    smembers(conn: Connection, key: string): any[];
    protected createNewKey(key: string): any;
    protected onTimer(): void;
}

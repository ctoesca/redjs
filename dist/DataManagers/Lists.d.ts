import { BaseDataManagers } from './BaseDataManagers';
import { Connection } from '../Connection';
export declare class Lists extends BaseDataManagers {
    constructor(opt: any);
    static getCommandsNames(): string[];
    lindex(conn: Connection, key: string, index: number): any;
    linsert(conn: Connection, key: string, position: string, pivot: string, value: string): number;
    lset(conn: Connection, key: string, index: number, value: string): string;
    lpush(conn: Connection, key: string, ...values: string[]): any;
    rpush(conn: Connection, key: string, ...values: string[]): any;
    rpop(conn: Connection, key: string): any;
    lpop(conn: Connection, key: string): any;
    llen(conn: Connection, key: string): number;
    protected createNewKey(key: string): any;
    protected onTimer(): void;
}

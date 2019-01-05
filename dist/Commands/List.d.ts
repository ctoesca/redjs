import { BaseDataset } from './BaseDataset';
import { Connection } from '../Connection';
export declare class Lists extends BaseDataset {
    protected data: any[];
    constructor(opt: any);
    getCommandsNames(): string[];
    lindex(conn: Connection, index: any): any;
    linsert(conn: Connection, position: string, pivot: string, value: string): number;
    lset(conn: Connection, index: any, value: string): string;
    lpush(conn: Connection, ...values: string[]): number;
    rpush(conn: Connection, ...values: string[]): number;
    rpop(conn: Connection): any;
    lpop(conn: Connection): any;
    llen(conn: Connection): number;
}

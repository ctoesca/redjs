import { BaseDataManagers } from './BaseDataManagers';
import { Connection } from '../Connection';
export declare class Hashes extends BaseDataManagers {
    protected clientsCursors: any;
    protected defaultScancount: number;
    protected lastCursorId: number;
    constructor(opt: any);
    static getCommandsNames(): string[];
    hscan(conn: Connection, key: string, cursor: number, ...options: any[]): string;
    hget(conn: Connection, key: string, field: string): any;
    hvals(conn: Connection, key: string): any[];
    hstrlen(conn: Connection, key: string, field: string): number;
    hset(conn: Connection, key: string, field: string, value: string): number;
    hsetnx(conn: Connection, key: string, field: string, value: string): number;
    hmget(conn: Connection, key: string, ...fields: string[]): any[];
    hmset(conn: Connection, key: string, field: string, value: string, ...fieldsValues: string[]): string;
    hgetall(conn: Connection, key: string): any[];
    hexists(conn: Connection, key: string, field: string): number;
    hdel(conn: Connection, key: string, ...fields: string[]): number;
    hkeys(conn: Connection, key: string): string[];
    hlen(conn: Connection, key: string): number;
    hincrby(conn: Connection, key: string, field: string, incr: number): any;
    hincrbyfloat(conn: Connection, key: string, field: string, incr: number): any;
    protected _incr(conn: Connection, key: string, field: string, incr: number): any;
    protected onTimer(): void;
}

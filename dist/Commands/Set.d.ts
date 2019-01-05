import { BaseDataset } from './BaseDataset';
import { Connection } from '../Connection';
export declare class RedisSet extends BaseDataset {
    protected data: Set<any>;
    constructor(opt: any);
    getCommandsNames(): string[];
    srem(conn: Connection, ...members: string[]): number;
    sadd(conn: Connection, ...members: string[]): number;
    smembers(conn: Connection): any[];
}

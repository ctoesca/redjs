import { BaseDataManagers } from './BaseDataManagers';
import { Connection } from '../Connection';
export declare class Keys extends BaseDataManagers {
    constructor(opt: any);
    getCommandsNames(): string[];
    clear(): void;
    get(key: string): any;
    set(key: string, object: any): any;
    del(conn: Connection, key: string, ...keys: string[]): number;
    exists(conn: Connection, key: string, ...keys: string[]): number;
    keys(conn: Connection, pattern: string): string[];
    protected onTimer(): void;
}

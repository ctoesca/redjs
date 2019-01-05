import { BaseDataManagers } from './BaseDataManagers';
import { Connection } from '../Connection';
export declare class Keys extends BaseDataManagers {
    constructor(opt: any);
    getCommandsNames(): string[];
    get(conn: Connection, key: string): any;
    set(conn: Connection, key: string, value: string): number;
    incr(conn: Connection, key: string): any;
    protected onTimer(): void;
}

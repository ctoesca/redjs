import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
export declare class Keys extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    getNotImplementedCommands(): string[];
    scan(conn: Connection, cursor: number, MATCH: string, pattern: string, COUNT: string, count: number): any[];
    del(conn: Connection, key: string, ...keys: string[]): number;
    exists(conn: Connection, key: string, ...keys: string[]): number;
    keys(conn: Connection, pattern: string): string[];
}

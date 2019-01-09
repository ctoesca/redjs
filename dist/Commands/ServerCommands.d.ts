import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
export declare class ServerCommands extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    flushdb(conn: Connection, async: string): {
        value: string;
        type: string;
    };
    time(conn: Connection): string[];
    monitor(conn: Connection): {
        value: string;
        type: string;
    };
    info(conn: Connection, section?: string): string;
    getServerInfo(): string[];
    protected getReplicationInfo(): string[];
    protected getCommandstatsInfo(): string[];
    protected getClientsInfo(): string[];
    protected getMemoryInfo(): string[];
    protected getPersistenceInfo(): string[];
    protected getStatsInfo(): string[];
    protected getCPUInfo(): string[];
    protected getKeyspaceInfo(): string[];
    protected getClusterInfo(): string[];
}

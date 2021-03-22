import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
export declare class ServerCommands extends AbstractCommands {
    constructor(opt: any);
    getCommandsNames(): string[];
    getNotImplementedCommands(): string[];
    check_flushdb(conn: Connection, async: string): void;
    flushdb(conn: Connection, async: string): string;
    check_flushall(conn: Connection, async: string): void;
    flushall(conn: Connection, async: string): string;
    check_time(conn: Connection): void;
    time(conn: Connection): string[];
    check_monitor(conn: Connection): void;
    monitor(conn: Connection): string;
    check_info(conn: Connection, section?: string): void;
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

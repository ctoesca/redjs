import { BaseDataManagers } from './BaseDataManagers';
import { Connection } from '../Connection';
export declare class PubSub extends BaseDataManagers {
    protected channels: Map<string, Map<string, Connection>>;
    protected patternsSubscriptions: Map<string, Map<string, Connection>>;
    constructor(opt: any);
    getCommandsNames(): string[];
    getSubscriptionsCount(conn: Connection): number;
    subscribe(conn: Connection, ...channels: string[]): any[];
    psubscribe(conn: Connection, ...patterns: string[]): any[];
    unsubscribe(conn: Connection, ...channels: string[]): any[];
    punsubscribe(conn: Connection, ...patterns: string[]): any[];
    publish(conn: Connection, channel: string, message: any): number;
    protected onConnectionClosed(conn: Connection): void;
    protected match(value: string, pattern: string): boolean;
    protected onTimer(): void;
}

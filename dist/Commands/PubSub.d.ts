import { AbstractCommands } from './AbstractCommands';
import { Connection } from '../Connection';
export declare class PubSub extends AbstractCommands {
    protected channels: Map<string, Map<string, Connection>>;
    protected patternsSubscriptions: Map<string, Map<string, Connection>>;
    protected _onConnectionClose: any;
    constructor(opt: any);
    destroy(): void;
    getCommandsNames(): string[];
    getNotImplementedCommands(): string[];
    getSubscriptionsCount(conn: Connection): number;
    subscribe(conn: Connection, ...channels: string[]): any[];
    psubscribe(conn: Connection, ...patterns: string[]): any[];
    unsubscribe(conn: Connection, ...channels: string[]): any[];
    punsubscribe(conn: Connection, ...patterns: string[]): any[];
    publish(conn: Connection, channel: string, message: any): number;
    protected _subscribe(conn: Connection, map: Map<string, Map<string, Connection>>, channels: string[]): string[];
    protected iterateAllSubscriptions(cb: Function): number;
    protected _unsubscribe(conn: Connection, map: Map<string, Map<string, Connection>>, channels: string[]): string[];
    protected onConnectionClosed(conn: Connection): void;
}

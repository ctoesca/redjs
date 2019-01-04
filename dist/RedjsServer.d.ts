/// <reference types="node" />
import { Timer } from './utils/Timer';
import { DataManager } from './DataManager';
import { Connection } from './Connection';
import Promise = require('bluebird');
import EventEmitter = require('events');
import bunyan = require('bunyan');
import net = require('net');
export declare class RedjsServer extends EventEmitter {
    server: net.Server;
    started: Boolean;
    lastError: any;
    connections: Map<string, Connection>;
    protected logger: bunyan;
    protected _workers: any;
    protected monitoredConnections: Map<string, Connection>;
    protected mainTimer: Timer;
    protected dataManager: DataManager;
    protected options: any;
    constructor(...opt: any[]);
    static getDefaultOptions(): {
        port: number;
        host: string;
    };
    broadcast(channel: string, msg: any, connections?: Map<string, Connection>): number;
    getConnectionsCount(): number;
    getMonitoredConnectionsCount(): number;
    start(): void;
    protected parseOptions(...args: any[]): void;
    protected onTimer(): void;
    protected onConnectionClosed(conn: Connection): void;
    protected onMonitoredConnection(conn: Connection): void;
    protected onCommand(conn: Connection, cmd: string, ...args: any[]): void;
    protected createServer(): Promise<{}>;
}

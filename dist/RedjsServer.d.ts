/// <reference types="node" />
import { Timer } from './utils/Timer';
import { Datastore } from './Data/Datastore';
import { Commander } from './Commander';
import { Connection } from './Connection';
import bunyan = require('bunyan');
import Promise = require('bluebird');
import EventEmitter = require('events');
import net = require('net');
export declare class RedjsServer extends EventEmitter {
    server: net.Server;
    started: Boolean;
    lastError: any;
    connections: Map<string, Connection>;
    datastore: Datastore;
    protected logger: any;
    protected _workers: any;
    protected monitoredConnections: Map<string, Connection>;
    protected mainTimer: Timer;
    protected commander: Commander;
    protected options: any;
    constructor(...opt: any[]);
    static createLogger(opt: any): bunyan;
    static getDefaultOptions(): {
        port: number;
        host: string;
    };
    broadcast(channel: string, msg: any, connections?: Map<string, Connection>): number;
    getConnectionsCount(): number;
    getMonitoredConnectionsCount(): number;
    start(): void;
    protected parseOptions(...args: any[]): void;
    protected logConnectionsCount(): void;
    protected onConnectionClosed(conn: Connection): void;
    protected onMonitoredConnection(conn: Connection): void;
    protected onCommand(conn: Connection, cmd: string, ...args: any[]): void;
    protected createServer(): Promise<{}>;
}

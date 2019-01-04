/// <reference types="node" />
import { Timer } from './utils/Timer';
import { DataManager } from './DataManager';
import { Parser } from './Parser';
import EventEmitter = require('events');
import bunyan = require('bunyan');
import net = require('net');
export declare class Connection extends EventEmitter {
    id: string;
    lastError: any;
    protected sock: net.Socket;
    protected dataManager: DataManager;
    protected logger: bunyan;
    protected mainTimer: Timer;
    protected systemCommands: any;
    protected parser: Parser;
    constructor(sock: net.Socket, dataManager: DataManager);
    getRemoteAddress(): string;
    getRemotePort(): number;
    writeMonitorData(data: any): void;
    writeChannelMessage(channel: string, payload: any): void;
    destroy(): void;
    protected onSockData(data: any): void;
    protected onSockError(err: any): void;
    protected onSockClose(): void;
    protected onTimer(): void;
    protected monitor(conn: Connection): string;
    protected ping(conn: Connection, responseExpected?: string): string;
    protected info(conn: Connection): string;
}

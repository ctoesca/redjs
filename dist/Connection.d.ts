/// <reference types="node" />
import { Timer } from './utils/Timer';
import { Database } from './Data/Database';
import { RedjsServer } from './RedjsServer';
import { Parser } from './utils/Parser';
import { Commander } from './Commander';
import EventEmitter = require('events');
import net = require('net');
export declare class Connection extends EventEmitter {
    id: string;
    lastError: any;
    database: Database;
    protected sock: net.Socket;
    protected commander: Commander;
    protected server: RedjsServer;
    protected logger: any;
    protected mainTimer: Timer;
    protected parser: Parser;
    protected closing: boolean;
    protected processingData: boolean;
    constructor(server: RedjsServer, sock: net.Socket, commander: Commander);
    getRemoteAddressPort(): string;
    writeMonitorData(data: any): void;
    writeChannelMessage(channel: string, payload: any): void;
    destroy(): void;
    quit(): void;
    pause(): void;
    resume(): void;
    protected onSockData(data: any): void;
    protected onSockError(err: any): void;
    protected onSockClose(): void;
}

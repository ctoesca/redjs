/// <reference types="node" />
import { Timer } from '../utils/Timer';
import EventEmitter = require('events');
import bunyan = require('bunyan');
import net = require('net');
export declare class Database extends EventEmitter {
    protected config: any;
    protected server: net.Server;
    protected logger: bunyan;
    protected mainTimer: Timer;
    protected keys: Map<string, any>;
    constructor(opt: any);
    createNewKey(key: string, object: any): Map<string, any>;
    getDataset(key: string): any;
    protected onTimer(): void;
}

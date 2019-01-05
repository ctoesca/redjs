/// <reference types="node" />
import { Timer } from '../utils/Timer';
import { Datastore } from './Datastore';
import EventEmitter = require('events');
import bunyan = require('bunyan');
import net = require('net');
export declare class Database extends EventEmitter {
    keys: Map<string, any>;
    protected config: any;
    protected server: net.Server;
    protected logger: bunyan;
    protected mainTimer: Timer;
    protected datastore: Datastore;
    constructor(opt: any);
    clear(): void;
    createNewKey(key: string, object: any): any;
    getDataset(key: string): any;
    protected onTimer(): void;
}
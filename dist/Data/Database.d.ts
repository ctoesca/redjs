/// <reference types="node" />
import { Timer } from '../utils/Timer';
import { Datastore } from './Datastore';
import EventEmitter = require('events');
import net = require('net');
export declare class Database extends EventEmitter {
    keys: Map<string, any>;
    protected config: any;
    protected server: net.Server;
    protected logger: any;
    protected mainTimer: Timer;
    protected datastore: Datastore;
    protected index: number;
    constructor(opt: any);
    getIndex(): number;
    clear(): void;
    createNewKey(key: string, object: any): any;
    getDataset(key: string): any;
}

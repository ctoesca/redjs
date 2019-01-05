/// <reference types="node" />
import { Timer } from '../utils/Timer';
import { Database } from './Database';
import EventEmitter = require('events');
import bunyan = require('bunyan');
import net = require('net');
export declare class Datastore extends EventEmitter {
    protected config: any;
    protected server: net.Server;
    protected logger: bunyan;
    protected mainTimer: Timer;
    protected databases: Database[];
    constructor(opt: any);
    getDb(index?: number): Database;
    protected onTimer(): void;
}

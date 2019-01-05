/// <reference types="node" />
import { Timer } from '../utils/Timer';
import { RedjsServer } from '../RedjsServer';
import { Datastore } from '../Data/Datastore';
import { Database } from '../Data/Database';
import bunyan = require('bunyan');
import EventEmitter = require('events');
export declare class AbstractCommands extends EventEmitter {
    protected config: any;
    protected server: RedjsServer;
    protected datastore: Datastore;
    protected logger: bunyan;
    protected mainTimer: Timer;
    protected data: any;
    constructor(opt: any);
    getCommandsNames(): string[];
    protected checkArgCount(cmd: string, args: IArguments, expected: number): void;
    protected checkMinArgCount(cmd: string, args: IArguments, expected: number): void;
    protected createNewKey(db: Database, key: string): any;
    protected getDataset(db: Database, key: string): any;
    protected getOrCreate(db: Database, key: string): any;
    protected match(value: string, pattern: string): boolean;
    protected onTimer(): void;
}

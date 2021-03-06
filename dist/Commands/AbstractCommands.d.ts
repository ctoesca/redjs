/// <reference types="node" />
import * as utils from '../utils';
import { RedjsServer } from '../RedjsServer';
import { Datastore } from '../Data/Datastore';
import { Database } from '../Data/Database';
import EventEmitter = require('events');
export declare class AbstractCommands extends EventEmitter {
    protected config: any;
    protected server: RedjsServer;
    protected datastore: Datastore;
    protected logger: any;
    protected mainTimer: utils.Timer;
    constructor(opt: any);
    destroy(): void;
    getCommandsNames(): string[];
    getNotImplementedCommands(): string[];
    protected checkType(obj: any, type: any): void;
    protected checkArgCount(cmd: string, args: IArguments, valueOrMin: number, max?: number): void;
    protected checkInt(v: any): void;
    protected createNewKey(db: Database, key: string): any;
    protected getDataset(db: Database, key: string): any;
    protected getDatasets(db: Database, ...keys: string[]): any[];
    protected getOrCreate(db: Database, key: string): any;
    protected match(value: string, pattern: string): boolean;
}

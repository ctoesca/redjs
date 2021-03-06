/// <reference types="node" />
import { Timer } from '../utils/Timer';
import { RedjsServer } from '../RedjsServer';
import { Database } from '../Database';
import bunyan = require('bunyan');
import EventEmitter = require('events');
export declare class BaseDataManagers extends EventEmitter {
    protected config: any;
    protected server: RedjsServer;
    protected db: Database;
    protected logger: bunyan;
    protected mainTimer: Timer;
    protected data: any;
    constructor(opt: any);
    getCommandsNames(): string[];
    protected checkArgCount(cmd: string, args: IArguments, expected: number): void;
    protected checkMinArgCount(cmd: string, args: IArguments, expected: number): void;
    protected createNewKey(key: string): any;
    protected getDataset(key: string): any;
    protected getOrCreate(key: string): any;
    protected match(value: string, pattern: string): boolean;
    protected onTimer(): void;
}

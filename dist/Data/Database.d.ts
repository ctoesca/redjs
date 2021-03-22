/// <reference types="node" />
import { Timer } from '../utils/Timer';
import { Datastore } from './Datastore';
import EventEmitter = require('events');
import net = require('net');
import { HashDataset } from './HashDataset';
import { ListDataset } from './ListDataset';
import { SetDataset } from './SetDataset';
import { StringsDataset } from './StringsDataset';
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
    createHashDataset(key: string): HashDataset;
    createListDataset(key: string): ListDataset;
    createSetDataset(key: string): SetDataset;
    createStringsDataset(key: string): StringsDataset;
    getDataset(key: string): any;
    save(path: string): void;
}

/// <reference types="node" />
import { Timer } from './utils/Timer';
import EventEmitter = require('events');
import bunyan = require('bunyan');
import net = require('net');
import { Connection } from './Connection';
import { Keys } from './DataManagers/Keys';
import { Hashes } from './DataManagers/Hashes';
import { PubSub } from './DataManagers/PubSub';
import { Lists } from './DataManagers/Lists';
import { Sets } from './DataManagers/Sets';
import { SortedSets } from './DataManagers/SortedSets';
import { BaseDataManagers } from './DataManagers/BaseDataManagers';
export declare class DataManager extends EventEmitter {
    protected config: any;
    protected server: net.Server;
    protected logger: bunyan;
    protected mainTimer: Timer;
    protected commands: any;
    protected hashes: Hashes;
    protected keys: Keys;
    protected pubsub: PubSub;
    protected sets: Sets;
    protected sortedSets: SortedSets;
    protected lists: Lists;
    constructor(opt: any);
    execCommand(cmd: string, conn: Connection, ...args: any[]): any;
    protected connect(conn: Connection, opt?: any): string;
    protected addComands(manager: BaseDataManagers): void;
    protected onTimer(): void;
}

/// <reference types="node" />
import { Timer } from './utils/Timer';
import EventEmitter = require('events');
import bunyan = require('bunyan');
import { RedjsServer } from './RedjsServer';
import { Datastore } from './data/Datastore';
import { Connection } from './Connection';
import { Keys } from './Commands/Keys';
import { Hashes } from './Commands/Hashes';
import { PubSub } from './Commands/PubSub';
import { Lists } from './Commands/Lists';
import { Sets } from './Commands/Sets';
import { SortedSets } from './Commands/SortedSets';
import { ServerCommands } from './Commands/ServerCommands';
import { ConnectionCommands } from './Commands/ConnectionCommands';
import { StringsCommands } from './Commands/StringsCommands';
import { AbstractCommands } from './Commands/AbstractCommands';
export declare class Commander extends EventEmitter {
    protected config: any;
    protected server: RedjsServer;
    protected datastore: Datastore;
    protected logger: bunyan;
    protected mainTimer: Timer;
    protected commands: any;
    protected hashes: Hashes;
    protected keys: Keys;
    protected pubsub: PubSub;
    protected sets: Sets;
    protected sortedSets: SortedSets;
    protected lists: Lists;
    protected stringsCommands: StringsCommands;
    protected connectionCommands: ConnectionCommands;
    protected serverCommands: ServerCommands;
    constructor(opt: any);
    execCommand(cmd: string, conn: Connection, ...args: any[]): any;
    protected addComands(manager: AbstractCommands): void;
    protected onTimer(): void;
}

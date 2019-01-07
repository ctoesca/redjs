/// <reference types="node" />
import EventEmitter = require('events');
export declare class BaseDataset extends EventEmitter {
    constructor(opt: any);
    getCommandsNames(): string[];
}

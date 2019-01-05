/// <reference types="node" />
import EventEmitter = require('events');
export declare class BaseDataset extends EventEmitter {
    constructor(opt: any);
    getCommandsNames(): string[];
    protected checkArgCount(cmd: string, args: IArguments, expected: number): void;
    protected checkMinArgCount(cmd: string, args: IArguments, expected: number): void;
}

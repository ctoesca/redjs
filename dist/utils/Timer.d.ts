/// <reference types="node" />
import EventEmitter = require('events');
export declare class Timer extends EventEmitter {
    static ON_TIMER: string;
    delay: number;
    running: boolean;
    count: number;
    protected intervalID: NodeJS.Timeout;
    constructor(args: any);
    destroy(): void;
    start(): void;
    reset(): void;
    stop(): void;
    protected _onTimer(): void;
}

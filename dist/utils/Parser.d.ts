/// <reference types="node" />
import EventEmitter = require('events');
export declare class Parser extends EventEmitter {
    constructor();
    fromRESP(data: any): any;
    toRESP(data: any, type?: string): string;
}

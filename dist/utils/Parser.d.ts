/// <reference types="node" />
import EventEmitter = require('events');
export declare class Parser extends EventEmitter {
    constructor();
    fromRESP(data: any): any;
    toRESP(data: any, type?: string): any;
    protected stringToResp(data: any, forcedType?: string): string;
    protected objectToResp(data: any): any;
    protected execRedisParser(data: any, results: any, errors: any): void;
}

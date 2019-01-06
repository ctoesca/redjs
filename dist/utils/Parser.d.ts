/// <reference types="node" />
import EventEmitter = require('events');
export declare class Parser extends EventEmitter {
    constructor();
    fromRESP(data: any): any;
    toRESP(data: any, type?: string): any;
    protected numberToResp(data: number, forcedType?: string): string;
    protected stringToResp(data: string, forcedType?: string): string;
    protected objectToResp(data: any, forcedType?: string): any;
    protected execRedisParser(data: any, results: any, errors: any): void;
}

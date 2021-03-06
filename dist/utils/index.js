"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBetween = exports.Timer = exports.parseURL = exports.isFloat = exports.isInt = void 0;
const urlParser = require("url");
const _ = require("lodash");
const Timer_1 = require("./Timer");
Object.defineProperty(exports, "Timer", { enumerable: true, get: function () { return Timer_1.Timer; } });
function randomBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
}
exports.randomBetween = randomBetween;
function parseURL(url) {
    if (isInt(url)) {
        return { port: url };
    }
    let parsed = urlParser.parse(url, true, true);
    if (!parsed.slashes && url[0] !== '/') {
        url = '//' + url;
        parsed = urlParser.parse(url, true, true);
    }
    let result = {};
    if (parsed.auth) {
        result.password = parsed.auth.split(':')[1];
    }
    if (parsed.pathname) {
        if (parsed.protocol === 'redis:') {
            if (parsed.pathname.length > 1) {
                result.db = parsed.pathname.slice(1);
            }
        }
        else {
            result.path = parsed.pathname;
        }
    }
    if (parsed.host) {
        result.host = parsed.hostname;
    }
    if (parsed.port) {
        result.port = parsed.port;
    }
    _.defaults(result, parsed.query);
    return result;
}
exports.parseURL = parseURL;
function isInt(value) {
    let x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
}
exports.isInt = isInt;
function isFloat(n) {
    let x = parseFloat(n);
    return !isNaN(x);
}
exports.isFloat = isFloat;
//# sourceMappingURL=index.js.map
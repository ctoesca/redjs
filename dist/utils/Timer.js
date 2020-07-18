"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
const EventEmitter = require("events");
let Timer = (() => {
    class Timer extends EventEmitter {
        constructor(args) {
            super();
            this.delay = null;
            this.running = false;
            this.count = 0;
            this.intervalID = null;
            if (typeof args.delay !== 'number') {
                throw 'delay argument is mandatory';
            }
            if (typeof args.onTimer === 'function') {
                this.on(Timer.ON_TIMER, args.onTimer);
            }
            this.delay = args.delay;
        }
        destroy() {
            this.stop();
            this.removeAllListeners(Timer.ON_TIMER);
        }
        start() {
            if (this.delay == null) {
                throw 'delay is null';
            }
            if (!this.running) {
                this.running = true;
                this.intervalID = setInterval(this._onTimer.bind(this), this.delay);
            }
        }
        reset() {
            if (this.running) {
                this.stop();
                this.start();
            }
            this.count = 0;
        }
        stop() {
            this.running = false;
            this.count = 0;
            if (this.intervalID) {
                clearInterval(this.intervalID);
            }
            this.intervalID = null;
        }
        _onTimer() {
            if (this.running) {
                this.emit(Timer.ON_TIMER);
                this.count++;
            }
        }
    }
    Timer.ON_TIMER = 'ON_TIMER';
    return Timer;
})();
exports.Timer = Timer;
//# sourceMappingURL=Timer.js.map
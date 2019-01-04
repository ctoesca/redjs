"use strict";

const EventEmitter = require('events');

module.exports = class Timer extends EventEmitter {

    constructor(args) {
        super();
        
        Timer.ON_TIMER = "ON_TIMER"

        this.delay = null;
        this.running = false;
        this.count = 0;
        this.intervalID = null;
        if (typeof args.delay != "number")
            throw "delay argument is mandatory";
        if (typeof args.onTimer == "function")
            this.on(Timer.ON_TIMER, args.onTimer);
        this.delay = args.delay;
    }
    destroy(){
        this.stop()
        this.removeAllListeners(Timer.ON_TIMER)
    }
    start() {
        if (this.delay == null)
            throw "delay is null";
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
        if (this.intervalID)
            clearInterval(this.intervalID);
        this.intervalID = null;
    }
    _onTimer(token) {
        if (this.running) {
            this.emit(Timer.ON_TIMER);
            this.count++;
        }
    }

}


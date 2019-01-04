
import EventEmitter = require('events')

export class Timer extends EventEmitter {

	public static ON_TIMER = 'ON_TIMER'
	public delay: number = null
	public running = false
	public count = 0
	protected intervalID: NodeJS.Timeout = null

	constructor(args: any) {

		super();

		if (typeof args.delay !== 'number') {
			throw 'delay argument is mandatory'
		}
		if (typeof args.onTimer === 'function') {
			this.on(Timer.ON_TIMER, args.onTimer)
		}
		this.delay = args.delay;
	}

	public destroy() {
		this.stop()
		this.removeAllListeners(Timer.ON_TIMER)
	}

	public start() {
		if (this.delay == null) {
			throw 'delay is null'
		}
		if (!this.running) {
			this.running = true
			this.intervalID = setInterval(this._onTimer.bind(this), this.delay)
		}
	}

	public reset() {
		if (this.running) {
			this.stop()
			this.start()
		}
		this.count = 0
	}

	public stop() {
		this.running = false
		this.count = 0
		if (this.intervalID) {
			clearInterval(this.intervalID)
		}
		this.intervalID = null;
	}

	protected _onTimer() {
		if (this.running) {
			this.emit(Timer.ON_TIMER);
			this.count++
		}
	}
}

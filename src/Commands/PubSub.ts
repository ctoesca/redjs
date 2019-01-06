
import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import {Database} from '../data/Database';
import Promise = require('bluebird');


export class PubSub extends AbstractCommands {

	protected channels: Map<string, Map<string, Connection>> = new Map<string,  Map<string, Connection>>()
	protected patternsSubscriptions: Map<string,  Map<string, Connection>> = new Map<string,  Map<string, Connection>>()

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return ['unsubscribe', 'subscribe', 'publish', 'PSUBSCRIBE', 'PUBSUB', 'PUNSUBSCRIBE' ]
	}

	public getSubscriptionsCount(conn: Connection) {
		let r = 0
		this.channels.forEach( ( connections: Map<string, Connection>, channel: string ) => {
			if (connections.has(conn.id)) {
				r ++
			}
		})
		this.patternsSubscriptions.forEach( ( connections: Map<string, Connection>, pattern: string ) => {
			if (connections.has(conn.id)) {
				r ++
			}
		})
		return r
	}

	/*
	- subscribe: means that we successfully subscribed to the channel given as the second element in the reply.
	The third argument represents the number of channels we are currently subscribed to.

	- unsubscribe: means that we successfully unsubscribed from the channel given as second element in the reply.
	The third argument represents the number of channels we are currently subscribed to. When the last argument is zero,
	we are no longer subscribed to any channel, and the client can issue any kind of Redis command as we are outside the Pub/Sub state.
	*/

	public subscribe(conn: Connection, ...channels: string[]) {

		this.checkMinArgCount('subscribe', arguments, 2)
		let r: any[] = ['subscribe']

		if ((channels.length < 1) || (channels[0] === undefined)) {
			throw 'ERR wrong number of arguments for \'psubscribe\' command'
		} else {

			for (let i = 0; i < channels.length; i++) {
				let channel = channels[i]

				let channelMap
				if (!this.channels.has(channel)) {
					channelMap = new Map()
					this.channels.set(channel, channelMap)
				} else {
					channelMap = this.channels.get(channel)
				}

				channelMap.set(conn.id, conn)

				r.push(channel)

				conn.on('close', () => {
					this.onConnectionClosed(conn)
				})

			}
		}
		r.push( this.getSubscriptionsCount(conn) )

		// conn.pause()

		return r
	}

	public psubscribe(conn: Connection, ...patterns: string[]) {
		let r: any[] = ['psubscribe']

		this.checkMinArgCount('psubscribe', arguments, 2)

		if ((patterns.length < 1) || (patterns[0] === undefined)) {
			throw 'ERR wrong number of arguments for \'psubscribe\' command'
		} else {
			for (let i = 0; i < patterns.length; i ++) {
				let pattern = patterns[i]
				let channelMap
				if (!this.patternsSubscriptions.has(pattern)) {
					channelMap = new Map()
					this.patternsSubscriptions.set(pattern, channelMap)
				} else {
					channelMap = this.patternsSubscriptions.get(pattern)
				}

				channelMap.set(conn.id, conn)
				r.push(pattern)

				conn.on('close', () => {
					this.onConnectionClosed(conn)
				})

			}
		}

		r.push( this.getSubscriptionsCount(conn) )

		// conn.pause()

		return r
	}

	public unsubscribe(conn: Connection, ...channels: string[]) {

		let r: any[] = ['unsubscribe']

		this.checkMinArgCount('unsubscribe', arguments, 2)

		if ((channels.length === 0) || (channels[0] === undefined)) {

			this.channels.forEach( ( connections: Map<string, Connection>, channel: string ) => {
				if (connections.has(conn.id)) {
					connections.delete(conn.id)
					r.push(channel)
				}
			})

		} else {
			for (let i = 0; i < channels.length; i ++) {
				let channelMap = this.channels.get(channels[i])
				if (typeof channelMap !== 'undefined') {
					channelMap.delete(conn.id)
					r.push(channels[i])
				}
			}
		}

		r.push( this.getSubscriptionsCount(conn) )
		return r
	}

	public punsubscribe(conn: Connection, ...patterns: string[]) {
		let r: any[] = ['punsubscribe']

		this.checkMinArgCount('punsubscribe', arguments, 2)

		/*
		Unsubscribes the client from the given patterns, or from all of them if none is given.
		When no patterns are specified, the client is unsubscribed from all the previously subscribed patterns.
		In this case, a message for every unsubscribed pattern will be sent to the client.
		*/

		if ((patterns.length === 0) || (patterns[0] === undefined)) {
			this.patternsSubscriptions.forEach( ( connections: Map<string, Connection>, channel: string ) => {
				if (connections.has(conn.id)) {
					connections.delete(conn.id)
					r.push(channel)
				}
			})
		} else {
			for (let i = 0; i < patterns.length; i ++) {
				let channelMap = this.patternsSubscriptions.get(patterns[i])
				if (typeof channelMap !== 'undefined') {
					channelMap.delete(conn.id)
					r.push(patterns[i])
				}
			}

		}

		r.push( this.getSubscriptionsCount(conn) )
		return r
	}


	public publish(conn: Connection, channel: string, message: any) {

		this.checkArgCount('publish', arguments, 3)

		let r = 0

		let destConnections: Map<string, Connection>

		/* channels subscriptions */
		if (this.channels.has(channel)) {
			destConnections = this.channels.get(channel)
		} else {
			destConnections = new Map<string, Connection>()
		}

		/* patterns subscriptions */
		this.patternsSubscriptions.forEach( ( connections: Map<string, Connection>, pattern: string ) => {
			if (this.match(channel, pattern)) {
				connections.forEach( ( connection: Connection, connId: string ) => {
					destConnections.set(connId, connection)
				})
			}
		})

		r += this.server.broadcast(channel, message, destConnections)

		return r
	}

	protected onConnectionClosed(conn: Connection) {
		this.channels.forEach( ( connections: Map<string, Connection>, channel: string ) => {
			connections.delete(conn.id)
		})
		this.patternsSubscriptions.forEach( ( connections: Map<string, Connection>, channel: string ) => {
			connections.delete(conn.id)
		})
	}



	protected onTimer() {

	}
}

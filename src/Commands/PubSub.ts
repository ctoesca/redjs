
import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import {Database} from '../data/Database';
import Promise = require('bluebird');


export class PubSub extends AbstractCommands {

	protected channels: Map<string, Map<string, Connection>> = new Map<string,  Map<string, Connection>>()
	protected patternsSubscriptions: Map<string,  Map<string, Connection>> = new Map<string,  Map<string, Connection>>()
	protected _onConnectionClose: any = this.onConnectionClosed.bind(this)

	constructor(opt: any) {
		super(opt);

		this.server.on('connection-close', this._onConnectionClose)
	}

	public destroy() {
		this.server.removeListener('connection-close', this._onConnectionClose)
		this.channels.clear();
		this.patternsSubscriptions.clear();
		super.destroy()
	}

	public getCommandsNames(): string[] {
		return ['unsubscribe', 'subscribe', 'publish', 'PSUBSCRIBE', 'PUBSUB', 'PUNSUBSCRIBE' ]
	}

	public getSubscriptionsCount(conn: Connection) {
		let r = 0;
		this.iterateAllSubscriptions( ( connections: Map<string, Connection>, channel: string, map: Map<string, any> ) => {
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

		this.checkArgCount('subscribe', arguments, 2, -1)

		let r: any[] = ['subscribe']

		r.concat( this._subscribe(conn, this.channels, channels) )

		r.push( this.getSubscriptionsCount(conn) )

		return r
	}

	public psubscribe(conn: Connection, ...patterns: string[]) {
		let r: any[] = ['psubscribe']

		this.checkArgCount('psubscribe', arguments, 2, -1)

		r.concat( this._subscribe(conn, this.patternsSubscriptions, patterns) )

		r.push( this.getSubscriptionsCount(conn) )

		return r
	}

	public unsubscribe(conn: Connection, ...channels: string[]) {

		let r: any[] = ['unsubscribe']

		this.checkArgCount('punsubscribe', arguments, 2, -1)

		r = r.concat( this._unsubscribe(conn, this.channels, channels) )

		r.push( this.getSubscriptionsCount(conn) )
		return r
	}

	public punsubscribe(conn: Connection, ...patterns: string[]) {
		let r: any[] = ['punsubscribe']

		this.checkArgCount('punsubscribe', arguments, 2, -1)

		/*
		Unsubscribes the client from the given patterns, or from all of them if none is given.
		When no patterns are specified, the client is unsubscribed from all the previously subscribed patterns.
		In this case, a message for every unsubscribed pattern will be sent to the client.
		*/
		r = r.concat( this._unsubscribe(conn, this.patternsSubscriptions, patterns) )

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

	protected _subscribe(conn: Connection, map: Map<string,  Map<string, Connection>>, channels: string[]) {
		let r: string[] = []
		for (let channel of channels) {
			let channelMap = map.get(channel)
			if (typeof channelMap === 'undefined') {
				channelMap = new Map()
				map.set(channel, channelMap)
			}

			channelMap.set(conn.id, conn)
			r.push(channel)
		}
		return r
	}

	protected iterateAllSubscriptions( cb: Function ) {
		let r = 0;
		for (let mapName of ['channels', 'patternsSubscriptions']) {
			let map: Map<string, any> = this[mapName]
			map.forEach( ( connections: Map<string, Connection>, channel: string ) => {
				if (cb) {
					cb(connections, channel, map)
				}
				r ++
			})
		}
		return r
	}

	protected _unsubscribe( conn: Connection, map: Map<string,  Map<string, Connection>>, channels: string[]) {

		let r: string[] = []
		let channelsToRemove: string[] = []

		map.forEach( ( connections: Map<string, Connection>, channel: string ) => {
			if (connections.has(conn.id)) {
				if (( channels.length === 0 ) ||  ( channels.indexOf(channel) >= 0 )) {
					connections.delete(conn.id)
					r.push(channel)
				}
				if (connections.size === 0) {
					channelsToRemove.push(channel)
				}
			}
		})

		for (let channel of channelsToRemove) {
			map.delete(channel)
		}

		return r
	}
	protected onConnectionClosed(conn: Connection) {

		this.iterateAllSubscriptions( ( connections: Map<string, Connection>, channel: string, map: Map<string, Map<string, Connection>> ) => {
			connections.delete(conn.id)
			if (connections.size === 0) {
				map.delete( channel )
			}
		})
	}

}

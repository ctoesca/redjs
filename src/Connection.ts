
import {Timer} from './utils/Timer';
import {DataManager} from './DataManager';
import * as utils from './utils';
import {Parser} from './Parser'

import Promise = require('bluebird');
import EventEmitter = require('events');
import bunyan = require('bunyan');
import _ = require('lodash');
import net = require('net');
import uuid = require('uuid/v4');


export class Connection extends EventEmitter {

	public id: string = null
	public lastError: any = null

	protected sock: net.Socket = null
	protected dataManager: DataManager = null
	protected logger: bunyan = null
	protected mainTimer: Timer = null
	protected systemCommands: any = null
	protected parser: Parser = null

	constructor(sock: net.Socket, dataManager: DataManager) {
		super();

		this.id = uuid()
		this.sock = sock
		this.dataManager = dataManager

		let constructor: any = this.constructor
		this.logger = bunyan.createLogger({ name: constructor.name })
		this.logger.debug(constructor.name + ' created')

		this.mainTimer = new Timer({delay: 10000})
		this.mainTimer.on(Timer.ON_TIMER, this.onTimer.bind(this))
		this.mainTimer.start()

		this.lastError = null

		this.sock.on('close', () => {
			this.onSockClose()
		})
		this.sock.on('data', (data) => {
			this.onSockData(data)
		})
		this.sock.on('error', (err: Error) => {
			this.onSockError(err)
		})

		let systemCommands = ['info', 'ping', 'monitor' ]
		this.systemCommands = {}
		for (let command of systemCommands) {
			this.systemCommands[command] = true
		}

		this.logger.debug('CONNECTED: ' + this.sock.remoteAddress + ':' + this.sock.remotePort)

		this.parser = new Parser()
	}

	public getRemoteAddress() {
		return this.sock.remoteAddress
	}
	public getRemotePort() {
		return this.sock.remotePort
	}

	public writeMonitorData( data: any ) {
		this.sock.write(this.parser.toRESP( data, 'simpleString' ) )
	}

	public writeChannelMessage( channel: string, payload: any) {
		let data = ['message', channel, payload]
		this.sock.write(this.parser.toRESP(data))
	}

	public destroy() {
		this.mainTimer.destroy()
		this.removeAllListeners()
		this.sock.removeAllListeners()
		this.sock = null
		this.dataManager = null
	}

	protected onSockData(data: any) {

		this.logger.debug('onSockData ' +  this.sock.remoteAddress + ': ' + data)
		let resp
		try {

			let requestData = this.parser.fromRESP(data)
			let cmd = requestData[0].toLowerCase()
			requestData.shift()

			if (this.listenerCount('command') > 0) {
				console.log('emit command')
				this.emit('command', this, cmd, ...requestData)
			}

			let responseData

			if (this.systemCommands[cmd]) {
				responseData = this[cmd]( this,  ...requestData)
				resp = this.parser.toRESP( responseData , 'simpleString')
				this.sock.write( resp );
			} else {
				responseData = this.dataManager.execCommand(cmd, this, ...requestData)
				resp = this.parser.toRESP( responseData )
				this.sock.write( resp )
			}
		} catch (err) {
			if (this.lastError !== err.toString()) {
				this.lastError = err.toString()
				console.error('REQUEST: ' + data.toString().replace(/\r\n/g, '\\r\\n') + ', ERROR: ' , err)
			}
			resp = this.parser.toRESP( err.toString(), 'error' )
			this.sock.write( resp );
		}
	}


	protected onSockError(err: any) {
		if (err.code !== 'ECONNRESET') {
			this.logger.error('ERROR: ' + this.sock.remoteAddress + ' ' + this.sock.remotePort, err);
		}
	}

	protected onSockClose() {
		this.logger.debug('CLOSED: ' + this.sock.remoteAddress + ' ' + this.sock.remotePort)
		this.emit('close')
	}

	protected onTimer() {

	}

	protected monitor(conn: Connection) {
		this.emit('monitor')
		return 'OK'
	}

	protected ping( conn: Connection, responseExpected: string = null) {
		let r = 'PONG'
		if (responseExpected) {
			r = responseExpected
		}
		return r
	}

	protected info(conn: Connection) {
		let r = `# Server
		redis_version:999.999.999
		redis_git_sha1:3c968ff0
		redis_git_dirty:0
		redis_build_id:51089de051945df4
		redis_mode:standalone
		os:Linux 4.8.0-1-amd64 x86_64
		arch_bits:64
		multiplexing_api:epoll
		atomicvar_api:atomic-builtin
		gcc_version:6.3.0
		process_id:3036
		run_id:868be887c3c27b100329d99321454df44d1e5394
		tcp_port:6379
		uptime_in_seconds:4215545
		uptime_in_days:48
		hz:10
		lru_clock:2978069
		executable:/usr/local/bin/redis-server
		config_file:

		# Clients
		connected_clients:0
		client_longest_output_list:0
		client_biggest_input_buf:0
		blocked_clients:0

		# Memory
		used_memory:385187088
		used_memory_human:367.34M
		used_memory_rss:400863232
		used_memory_rss_human:382.29M
		used_memory_peak:388938688
		used_memory_peak_human:370.92M
		used_memory_peak_perc:99.04%
		used_memory_overhead:121386320
		used_memory_startup:510704
		used_memory_dataset:263800768
		used_memory_dataset_perc:68.58%
		allocator_allocated:385181800
		allocator_active:385437696
		allocator_resident:398086144
		total_system_memory:1044770816
		total_system_memory_human:996.37M
		used_memory_lua:37888
		used_memory_lua_human:37.00K
		maxmemory:0
		maxmemory_human:0B
		maxmemory_policy:noeviction
		allocator_frag_ratio:1.00
		allocator_frag_bytes:255896
		allocator_rss_ratio:1.03
		allocator_rss_bytes:12648448
		rss_overhead_ratio:1.01
		rss_overhead_bytes:2777088
		mem_fragmentation_ratio:1.04
		mem_fragmentation_bytes:15759144
		mem_allocator:jemalloc-4.0.3
		active_defrag_running:0
		lazyfree_pending_objects:0

		# Persistence
		loading:0
		rdb_changes_since_last_save:0
		rdb_bgsave_in_progress:0
		rdb_last_save_time:0
		rdb_last_bgsave_status:ok
		rdb_last_bgsave_time_sec:-1
		rdb_current_bgsave_time_sec:-1
		rdb_last_cow_size:0
		aof_enabled:0
		aof_rewrite_in_progress:0
		aof_rewrite_scheduled:0
		aof_last_rewrite_time_sec:-1
		aof_current_rewrite_time_sec:-1
		aof_last_bgrewrite_status:ok
		aof_last_write_status:ok
		aof_last_cow_size:0

		# Stats
		total_connections_received:0
		total_commands_processed:0
		instantaneous_ops_per_sec:0
		total_net_input_bytes:0
		total_net_output_bytes:0
		instantaneous_input_kbps:0
		instantaneous_output_kbps:0
		rejected_connections:0
		sync_full:0
		sync_partial_ok:0
		sync_partial_err:0
		expired_keys:0
		expired_stale_perc:0.00
		expired_time_cap_reached_count:0
		evicted_keys:0
		keyspace_hits:0
		keyspace_misses:0
		pubsub_channels:0
		pubsub_patterns:0
		latest_fork_usec:0
		migrate_cached_sockets:0
		slave_expires_tracked_keys:0
		active_defrag_hits:0
		active_defrag_misses:0
		active_defrag_key_hits:0
		active_defrag_key_misses:0

		# CPU
		used_cpu_sys:0.00
		used_cpu_user:0.00
		used_cpu_sys_children:0.00
		used_cpu_user_children:0.00

		# Cluster
		cluster_enabled:0

		# Keyspace
		db0:keys=2178548,expires=1238,avg_ttl=24678389575`

		return r
	}
}

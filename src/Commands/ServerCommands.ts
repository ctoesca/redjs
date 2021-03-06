import {AbstractCommands} from './AbstractCommands';
import {Connection} from '../Connection';
import {Database} from '../data/Database';
import Promise = require('bluebird');
import {IDataset} from '../Data/IDataset'

export class ServerCommands extends AbstractCommands {

	constructor(opt: any) {
		super(opt);
	}

	public getCommandsNames(): string[] {
		return [
		'flushall',
		'flushdb',
		'info',
		'monitor',
		'time']
	}
	public getNotImplementedCommands(): string[] {
		return ['acl ', // cat deluser genpass getuser help list load log save setuser users whoami
		'bgrewriteaof',
		'bgsave',
		'command', // count, getkeys, info
		'config', // get, resetstat, rewrite, set
		'dbsize',
		'debug', // object, segfault
		'failover',
		'lastsave',
		'latency', // doctor, graph, help, history, latest, reset
		'lolwut',
		'memory', // doctor, help, malloc-stats, purge, stats, usage
		'module', // list, load, unload
		'psync',
		'replicaof',
		'role',
		'save',
		'shutdown',
		'slaveof',
		'slowlog',
		'swapdb',
		'sync'
		]
	}

	public check_flushdb( conn: Connection, async: string ) {
		this.checkArgCount('flushdb', arguments, 1, 2)
	}
	public flushdb( conn: Connection, async: string) {
		conn.database.clear()
		return 'OK'
	}

	public check_flushall( conn: Connection, async: string ) {
		this.checkArgCount('flushall', arguments, 1, 2)
	}
	public flushall( conn: Connection, async: string) {
		this.datastore.clear()
		return 'OK'
	}


	public check_time( conn: Connection ) {
		this.checkArgCount('time', arguments, 1, 1)
	}
	public time( conn: Connection) {
		let r: string[] = []
		let now = Date.now().toString()
		// 1546997952162
		r.push(   now.substr(0, now.length - 3) ) // 1546997952
		r.push(  now.substr( r[0].length ) + '000' )   // 162000
		return r
	}

	public check_monitor( conn: Connection ) {
		this.checkArgCount('monitor', arguments, 1)
	}
	public monitor(conn: Connection) {
		conn.emit('monitor')
		return 'OK'
	}

	public check_info( conn: Connection, section = 'all' ) {
		this.checkArgCount('info', arguments, 1, 2)
	}
	public info(conn: Connection, section = 'all') {

		// !!
		/*
		# Server
		# Clients
		# Memory
		# Persistence
		# Stats
		# Replication
		# CPU
		# Commandstats
		# Cluster
		# Keyspace
		*/

		let r = ''

		for (let type of ['Server', 'Clients', 'Memory', 'Persistence', 'Stats', 'Replication', 'CPU', 'Commandstats', 'Cluster', 'Keyspace']) {
			let f = 'get' + type + 'Info'
			r += '#' + type + '\n'
			r += this[f]().join('\n') + '\n' + '\n'
		}

		return r
	}
	public getServerInfo() {
		return [
			'redis_version:999.999.999',
			'redis_git_sha1:3c968ff0',
			'redis_git_dirty:0',
			'redis_build_id:51089de051945df4',
			'redis_mode:standalone',
			'os:Linux 4.8.0-1-amd64 x86_64',
			'arch_bits:64',
			'multiplexing_api:epoll',
			'atomicvar_api:atomic-builtin',
			'gcc_version:6.3.0',
			'process_id:3036',
			'run_id:868be887c3c27b100329d99321454df44d1e5394',
			'tcp_port:6379',
			'uptime_in_seconds:4215545',
			'uptime_in_days:48',
			'hz:10',
			'lru_clock:2978069',
			'executable:/usr/local/bin/redis-server',
			'config_file:redis.MASTER.conf'
		]
	}


	protected getReplicationInfo() {
		return [
			'role:master',
			'connected_slaves:1',
			'slave0:ip=127.0.0.1,port=6380,state=online,offset=27945,lag=1',
			'master_repl_offset:27945',
			'repl_backlog_active:1',
			'repl_backlog_size:1048576',
			'repl_backlog_first_byte_offset:2',
			'repl_backlog_histlen:27944'
		]
	}
	protected getCommandstatsInfo() {
		return [
			'cmdstat_keys:calls=1,usec=0,usec_per_call=0.00',
			'cmdstat_ping:calls=1,usec=0,usec_per_call=0.00',
			'cmdstat_psync:calls=1,usec=3000,usec_per_call=3000.00',
			'cmdstat_replconf:calls=19969,usec=0,usec_per_call=0.00',
			'cmdstat_subscribe:calls=2,usec=0,usec_per_call=0.00'
		]
	}

	protected getClientsInfo() {
		return [
			'connected_clients:0',
			'client_longest_output_list:0',
			'client_biggest_input_buf:0',
			'blocked_clients:0'
		]
	}

	protected getMemoryInfo() {

		/*
		used_memory:25669192
		used_memory_human:24.48M
		used_memory_rss:25631376
		used_memory_peak:25726136
		used_memory_peak_human:24.53M
		used_memory_lua:36864
		mem_fragmentation_ratio:1.00
		mem_allocator:jemalloc-3.6.0
		*/

		return [
			'used_memory:385187088',
			'used_memory_human:367.34M',
			'used_memory_rss:400863232',
			'used_memory_rss_human:382.29M',
			'used_memory_peak:388938688',
			'used_memory_peak_human:370.92M',
			'used_memory_peak_perc:99.04%',
			'used_memory_overhead:121386320',
			'used_memory_startup:510704',
			'used_memory_dataset:263800768',
			'used_memory_dataset_perc:68.58%',
			'total_system_memory:1044770816',
			'total_system_memory_human:996.37M',
			'used_memory_lua:37888',
			'used_memory_lua_human:37.00K',
			'mem_fragmentation_ratio:1.04',
			'mem_allocator:jemalloc-4.0.3'
		]
	}

	protected getPersistenceInfo() {
		return [
			'loading:0',
			'rdb_changes_since_last_save:0',
			'rdb_bgsave_in_progress:0',
			'rdb_last_save_time:0',
			'rdb_last_bgsave_status:ok',
			'rdb_last_bgsave_time_sec:-1',
			'rdb_current_bgsave_time_sec:-1',
			'rdb_last_cow_size:0',
			'aof_enabled:0',
			'aof_rewrite_in_progress:0',
			'aof_rewrite_scheduled:0',
			'aof_last_rewrite_time_sec:-1',
			'aof_current_rewrite_time_sec:-1',
			'aof_last_bgrewrite_status:ok',
			'aof_last_write_status:ok',
			'aof_last_cow_size:0'
		]
	}
	protected getStatsInfo() {
		return [
			'total_connections_received:0',
			'total_commands_processed:0',
			'instantaneous_ops_per_sec:0',
			'total_net_input_bytes:0',
			'total_net_output_bytes:0',
			'instantaneous_input_kbps:0',
			'instantaneous_output_kbps:0',
			'rejected_connections:0',
			'sync_full:0',
			'sync_partial_ok:0',
			'sync_partial_err:0',
			'expired_keys:0',
			'expired_stale_perc:0.00',
			'expired_time_cap_reached_count:0',
			'evicted_keys:0',
			'keyspace_hits:0',
			'keyspace_misses:0',
			'pubsub_channels:0',
			'pubsub_patterns:0',
			'latest_fork_usec:0',
			'migrate_cached_sockets:0',
			'slave_expires_tracked_keys:0',
			'active_defrag_hits:0',
			'active_defrag_misses:0',
			'active_defrag_key_hits:0',
			'active_defrag_key_misses:0'
		]
	}

	protected getCPUInfo() {
		return [
			'used_cpu_sys:0.00',
			'used_cpu_user:0.00',
			'used_cpu_sys_children:0.00',
			'used_cpu_user_children:0.00'
		]
	}

	protected getKeyspaceInfo() {
		return [
			'db0:keys=12,expires=0,avg_ttl=0',
			'db1:keys=1,expires=0,avg_ttl=0'
		]
	}

	protected getClusterInfo() {
		return [
			'cluster_enabled:0'
		]
	}

}

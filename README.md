# redjs

[![Build Status](https://travis-ci.org/ctoesca/redjs.svg?branch=master)](https://travis-ci.org/ctoesca/redjs)
[![Maintainability](https://api.codeclimate.com/v1/badges/a865589db2e1d75ca37f/maintainability)](https://codeclimate.com/github/ctoesca/redjs/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a865589db2e1d75ca37f/test_coverage)](https://codeclimate.com/github/ctoesca/redjs/test_coverage)

Redjs is a Redis-like in-memory data store. It can be used with [Ioredis](https://github.com/luin/ioredis), [NodeRedis](https://github.com/NodeRedis/node_redis) and by other applications (nodejs or not).

Very often, a Nodejs application uses 'cluster' module, and is running on several processes (or several servers). Then you need to share data and send messages (pub/sub) between processes.

Redis is a good solution to do that, but sometime you want to provide a standalone application without dependencies. You can then embed Redjs server in your nodejs application (or in a dedicated nodejs application) and use it like Redis.

Notes: 
- The purpose of this module is not to compete with Redis (the performance of Redjs is about 2 to 3 times less than Redis, and there is no replication or cluster) but to provide a shared memory and a pub-sub system between nodejs processes, using "standard" client modules like ioredis, node_redis etc.
- Redjs imlement Redis protocol and behaves like Redis: so it can be used by any application.
- All operations are performed in-memory, on master process. 
- Persistence is not yet implemented


## Quick Start

### Install
```shell
$ npm install ctoesca/redjs
```

### Create and start Redjs


#### In a single process application:
```javascript
/* create RedjsServer */
var RedjsServer = require('Redjs')      
new RedjsServer().start(6379)
```


#### If you use 'cluster' module, RedjsServer must be created in master process:

```javascript
if (cluster.isMaster){

    /* MASTER PROCESS */
    
    var numProcesses = 2
    for (var i=0; i<numProcesses; i++)
	cluster.fork();
		
    cluster.on('exit', (worker, code, signal) => {
    	console.log(`worker ${worker.process.pid} died code=`+code);
	cluster.fork();
    })
    
    /* create RedjsServer */
    var RedjsServer = require('Redjs')      
    new RedjsServer().start(6379)
    
}else{
    /* 
    WORKER PROCESS
    */				
}
```


### Using Redjs server with your favorite client library ([Ioredis](https://github.com/luin/ioredis) in this example)
  
```javascript
var Redis = require('ioredis');
var redis = new Redis();

redis.set('foo', 'bar');
redis.get('foo', function (err, result) {
  console.log(result);
});

// Or using a promise if the last argument isn't a function
redis.get('foo').then(function (result) {
  console.log(result);
});

// Arguments to commands are flattened, so the following are the same:
redis.sadd('set', 1, 3, 5, 7);
redis.sadd('set', [1, 3, 5, 7]);
```

### Using Redjs with redis-cli
  
Of course, you can connect to redjs with redis-cli program (provided with redis):

```bash
redis-cli -p 6379
127.0.0.1:6379> hset hash1 var1 foo
(integer) 1
127.0.0.1:6379> hget hash1 var1
"foo"
127.0.0.1:6379> hgetall hash1
1) "var1"
2) "foo"
```

## Available commands (work in progress...)


### Pub/sub

- subscribe
- unsubscribe
- publish
- psubscribe
- punsubscribe

### Lists

- lpush
- rpush
- llen
- rpop
- lpop
- lindex
- lset
- linsert
- lrange
- lset

### Hashes

- hkeys
- hlen
- hget
- hset
- hmget
- hmset
- hdel
- hexists
- hgetall
- hincrby
- hincrbyfloat
- hsetnx
- hstrlen
- hvals

### Keys

- del
- exists
- keys

### Sets

- sadd
- srem
- smembers
- spop
- sismember
- sunion
- scard
- srandmember

### Strings

- get
- set
- incr

### Server
- monitor
- flushdb
- flushall
- info
- time

### Connection
- ping
- echo
- quit

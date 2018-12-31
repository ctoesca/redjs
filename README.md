# redjs
Redjs is a Redis-like in-memory data store, for use in nodejs cluster.

No Redis installation is required: all operations are performed in-memory.

Very often, a Nodejs application use 'cluster' module, and is running on several processes. Then you need to share data and send messages (pub/sub) between processes.

Redis is a good solution to do that, but sometime you want to provide a standalone application without heavy dependencies. You can then use Redjs and later, replace Redjs with [Ioredis](https://github.com/luin/ioredis), without changing the code.


# Quick Start

## Install
```shell
$ npm install redjs
```

## Basic Usage

#### RedjsServer must be created in master process. Example (index.js) :

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
    var RedjsServer = require('Redjs').RedjsServer		
    var redjsServer = new RedjsServer()
    redjsServer.start()
    
}else{
    /* 
    WORKER PROCESS: use Redjs client
    */				
}
```

#### Then you can use Redjs client in your workers processes:
  
```javascript
var Redjs = require('Redjs');
var redjs = new Redjs();

redjs.set('foo', 'bar');
redjs.get('foo', function (err, result) {
  console.log(result);
});

// Or using a promise if the last argument isn't a function
redjs.get('foo').then(function (result) {
  console.log(result);
});

// Arguments to commands are flattened, so the following are the same:
redjs.sadd('set', 1, 3, 5, 7);
redjs.sadd('set', [1, 3, 5, 7]);
```

## Available commands (Work in progress...)

### Pub/sub

- subscribe
- unsubscribe
- publish

### Hashes

- hget
- hset

### Keys

- get
- set
- incr

### Sets

- sadd
- srem
- smembers



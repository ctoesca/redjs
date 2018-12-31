# redjs
Redjs is a Redis-like in-memory data store, for use in nodejs cluster.

No Redis installation is required: all operations are performed in-memory.

Redjs can be replaced by [Ioredis](https://github.com/luin/ioredis) if you want to use Redis.

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
    var redjsServer = new RedjsServer({})
    redjsServer.start()
    
}else{
    /* WORKER: 
    use Redjs client
    */				
}
```

#### Then you can use Redjs client in your workers:
  
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

// All arguments are passed directly to the redis server:
redjs.set('key', 100, 'EX', 10);
```

## Pub/Sub

Like in ioredis, Pub/Sub is supported.



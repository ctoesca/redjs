# redjs
Embedded Redis-like in-memory data store, for use in nodejs cluster

# Quick Start

## Install
```shell
$ npm install redjs
```

## Basic Usage

RedjsServer must be created in master process. Example (index.js) :

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
		
		var redjsServer = new RedjsServer({})
		redjsServer.start()

}else{
		/* WORKER */
				
}
  
  
  
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

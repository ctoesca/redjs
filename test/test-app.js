const RedjsServer = require('..')
const cluster = require('cluster');
const Redis = require('ioredis')

global.PORT= 6970

// Use bluebird
Redis.Promise = require('bluebird')


global.getRedis = function(){
	return new Redis(global.PORT)	
}

if (cluster.isMaster)
{
	cluster.fork();
	
	cluster.on('fork', (worker) => {
		console.log("************ FORK WORKER **************")
	})
	cluster.on('exit', (worker, code, signal) => {
		console.log("exitCode="+code)
		process.exit(code)
	})
	var redjsServer = new RedjsServer(global.PORT)
	redjsServer.start()

}else 
{
	/* WORKER */

	console.log("************ WORKER CREATED **************")

	var Mocha = require('mocha'),
	fs = require('fs'),
	path = require('path');


	// Instantiate a Mocha instance.
	var mocha = new Mocha({
	    reporter: 'spec'
	});

	var testDir = __dirname

	fs.readdirSync(testDir).filter(function(file) {
	    return (file.substr(-3) === '.js') && (file != 'test-app.js');

	}).forEach(function(file) {
		console.log("ADD FILE "+file)
	    mocha.addFile(
	        path.join(testDir, file)
	    );
	});

	// Run the tests.
	mocha.run(function(failures) {

	  	var exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
	  	console.log("EXITCODE="+exitCode)
	  	process.exitCode = exitCode
	 
			process.exit(exitCode)

	});

}



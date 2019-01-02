const RedjsServer = require('..').RedjsServer
const Redjs = require('..')
const cluster = require('cluster');



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
		var redjsServer = new RedjsServer()
		redjsServer.start()

	}else 
	{
		/* WORKER */
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

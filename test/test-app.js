const RedjsServer = require('..')
const cluster = require('cluster')
const Redis = require('ioredis')
const Mocha = require('mocha')
const fs = require('fs')
const path = require('path')

global.PORT= 6970
global.HOST= "127.0.0.1"

// Use bluebird
Redis.Promise = require('bluebird')

RedjsServer.createLogger = function( opt ) {
	return {
		"fatal" : console.error,
		"error" : console.error,
		"warn" : console.warn,
		"info" : console.info,
		"debug" : function(){},
		"trace": function(){}
	}
}

global.getRedis = function(){
	console.log('Get Redis')
	return new Redis(global.PORT, global.HOST)	
}


/* WORKER */
var redjsServer = new RedjsServer(global.PORT, global.HOST, {})
redjsServer.start()

console.log("************ WORKER CREATED **************")

var testDir = __dirname

var mocha = new Mocha({
    //reporter: 'spec'
    reporter: 'mochawesome',
    reporterOptions: {
    	reportDir: __dirname+'/mocha-report'
      	//reportName: 'report',
    }
});

fs.readdirSync(testDir).filter(function(file) {
    return (file.substr(-3) === '.js') && (file != 'test-app.js');

}).forEach(function(file) {
	console.log("ADD FILE "+file)
    mocha.addFile(
        path.join(testDir, file)
    );
});

// Run the tests.
// Instantiate a Mocha instance.
mocha.run(function(failures) {

  	var exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
  	console.log("EXITCODE="+exitCode)	
	process.exitCode = exitCode
	process.exit()
});




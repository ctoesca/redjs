const Redjs = require('..');
const Redis = require('ioredis');
const assert = require('assert');

describe('Server commands', function() 
{
	
				

	describe('monitor', function() {
	    it('should receive monitor command "keys test-monitor" on DB 0', function( done ) {

	    	this.timeout(3000);

			var redis = getRedis()

	    	redis.monitor(function (err, monitor) {
  				if (err){
  					done(err)
  				}else
  				{
  					monitor.on('monitor', function (time, args, source, database) {
  						console.log('ON MONITOR ',time, args, source, database)
  						assert.equal( database, 0)
  						if ((args[0] === 'keys') && (args[1] === 'test-monitor') && (database==0)){
                  redis.on('close', function(){
                      done()
                  })
                  redis.quit()	
              }				
  							
  					})

  					var redis2 = getRedis()
  					redis2.keys('test-monitor')
  				}
	    		
			});

	    });
  	});


});

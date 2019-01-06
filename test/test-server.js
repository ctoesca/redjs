const Redjs = require('..');
const Redis = require('ioredis');
const assert = require('assert');

describe('Server commands', function() 
{
	
	var redis = getRedis()


	describe('monitor', function() {
	    it('should receive monitor commnd "keys *" on DB 0', function( done ) {

	    	this.timeout(3000);

	    	redis.monitor(function (err, monitor) {
  				if (err){
  					done(err)
  				}else
  				{
  					monitor.on('monitor', function (time, args, source, database) {
  						assert.equal( database, 0)
  						assert.deepEqual( args, ['keys','*'])
  						done()
  					})
  					redis.keys('*')
  				}
	    		
			});

	    });
  	});


});

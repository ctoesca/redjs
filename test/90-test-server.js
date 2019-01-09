const Redjs = require('..');
const Redis = require('ioredis');
const assert = require('assert');

describe('Server commands', function() 
{
	
	var redis = getRedis()

  describe('time', function() {
      it('should return [secondes, milli]', function( done ) {
        redis.time()
        .then( function(r){
          if (r.length ===2)
          {
            //1546998696
            //652000
            if (  r[0].match(/[0-9]{10}/) && r[1].match(/[0-9]{6}/) )
              done()
          }else{
            done('Incorrect response: '+JSON.stringify(r))
          }
        })
        .catch( done )
      });
  });


	describe('monitor', function() {
	    it('should receive monitor command "keys test-monitor" on DB 0', function( done ) {

	    	this.timeout(3000);

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

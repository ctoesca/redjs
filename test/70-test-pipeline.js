
const assert = require('assert');

describe('Strings', function() 
{

	var redis = getRedis()

	describe('pipeline', function() {
	    it('should return OK', function( done ) {

	    	var pipeline = redis.pipeline();
			pipeline.set('foo', 'bar');
			pipeline.del('cc');
			pipeline.exec(function (err, results) {
			  // `err` is always null, and `results` is an array of responses
			  // corresponding to the sequence of queued commands.
			  // Each response follows the format `[err, result]`.
			  if (err){
			  	done(err)
			  }else{
			  	assert.deepEqual(results, [ [ null, 'OK' ], [ null, 0 ] ]);
	    		done()
			  }
			});

	    });
  	});

	
});

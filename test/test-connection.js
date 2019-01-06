const Redjs = require('..');
const Redis = require('ioredis');
const assert = require('assert');

describe('Connect Events', function() 
{
	var redis = getRedis()

	describe('connect', function() {
	    it('should receive "connect" event', function( done ) {
	    	
	    	var onEvent = function(r){	    		
	    		redis.removeListener('connect', onEvent)
	    		done()
	    	}
	    	redis.on('connect', onEvent)	
	    });
  	});

	describe('echo toto', function() {
	    it('should receive "toto"', function( done ) {
	    	
	    	redis.echo('toto')
	    	.then( function(r){
	    		assert.equal(r, "toto");
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

});

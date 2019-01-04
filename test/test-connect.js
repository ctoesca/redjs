const Redjs = require('..');
const Redis = require('ioredis');
const assert = require('assert');

describe('Connect Events', function() 
{

	describe('connect', function() {
	    it('should receive "connect" event', function( done ) {
	    	
	    	var redis = getRedis()

	    	var onEvent = function(r){	    		
	    		redis.removeListener('connect', onEvent)
	    		done()
	    	}

	    	redis.on('connect', onEvent)	
	    });
  	});


	/*describe('connect error', function() {
	    it('should receive "error" event', function( done ) {
	    	
	    	var redis = new Redjs()

	    	var onEvent = function(err){	    		
	    		redis.removeListener('error', onEvent)
	    		done()
	    	}

	    	redis.on('error', onEvent)	
	    });
  	});*/




});

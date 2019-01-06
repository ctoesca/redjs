
const assert = require('assert');

describe('Sets', function() 
{
	var redis = getRedis()

	
  	describe('sadd set1 var1 var2', function() {
	    it('should return 2', function( done ) {
	    	redis.sadd('set1', 'var1', 'var2')
	    	.then( function(r){
	    		assert.equal(r, 2);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('smembers set1', function() {
	    it('should return [var1, var2]', function( done ) {
	    	redis.smembers('set1')
	    	.then( function(r){
	    		assert.deepEqual(r, ['var1', 'var2'] );
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('smembers set2', function() {
	    it('should return []', function( done ) {
	    	redis.smembers('set2')
	    	.then( function(r){
	    		assert.deepEqual(r, [] );
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('srem set1 var2', function() {
	    it('should return 1', function( done ) {
	    	redis.srem('set1', 'var2')
	    	.then( function(r){
	    		assert.equal(r, 1);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('srem set1 tututu', function() {
	    it('should return 0', function( done ) {
	    	redis.srem('set1', 'tututu')
	    	.then( function(r){
	    		assert.equal(r, 0);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('smembers set1', function() {
	    it('should return [var1]', function( done ) {
	    	redis.smembers('set1')
	    	.then( function(r){
	    		assert.deepEqual(r, ['var1'] );
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  

});

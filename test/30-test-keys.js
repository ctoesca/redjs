
const assert = require('assert');

describe('Keys', function() 
{
	var redis = getRedis()

	describe('flushdb', function() {
	    it('should return OK', function( done ) {
	    	redis.flushdb()
	    	.then( function(r){
	    		assert.equal(r, "OK");
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

	describe('hset key1 var1 toto', function() {
	    it('should return 1', function( done ) {
	    	redis.hset('key1', 'var1', 'toto')
	    	.then( function(r){
	    		assert.equal(r, 1);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

	describe('lpush key2 var1', function() {
	    it('should return 1', function( done ) {
	    	redis.lpush('key2', 'var1')
	    	.then( function(r){
	    		assert.equal(r, 1);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

	/* keys */
  	describe('keys', function() {
	    it('should return error', function( done ) {
	    	redis.keys()
	    	.then( function(r){
	    		done("no error: result = "+r)
	    	})
	    	.catch( err => {
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('keys *', function() {
	    it('should return [key1, key2]', function( done ) {
	    	redis.keys('*')
	    	.then( function(r){
	    		assert.deepEqual(r, ['key1', 'key2']);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('keys k*', function() {
	    it('should return [key1, key2]', function( done ) {
	    	redis.keys('k*')
	    	.then( function(r){
	    		assert.deepEqual(r, ['key1', 'key2']);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('exists key10', function() {
	    it('should return 0', function( done ) {
	    	redis.exists('key10')
	    	.then( function(r){
	    		assert.equal(r, 0);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});
  	describe('exists key1', function() {
	    it('should return 1', function( done ) {
	    	redis.exists('key1')
	    	.then( function(r){
	    		assert.equal(r, 1);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});
  	  	describe('exists key1 key2', function() {
	    it('should return 2', function( done ) {
	    	redis.exists('key1', 'key2')
	    	.then( function(r){
	    		assert.equal(r, 2);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

	/* del */
  	describe('del key1 key2', function() {
	    it('should return 2', function( done ) {
	    	redis.del('key1', 'key2')
	    	.then( function(r){
	    		assert.equal(r, 2);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('keys *', function() {
	    it('should return []', function( done ) {
	    	redis.keys('*')
	    	.then( function(r){
	    		assert.deepEqual(r, []);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	

});

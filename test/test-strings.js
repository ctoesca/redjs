
const assert = require('assert');

describe('Strings', function() 
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

	describe('set string1 toto', function() {
	    it('should return OK', function( done ) {
	    	redis.set('string1', 'toto')
	    	.then( function(r){
	    		assert.equal(r, 'OK');
	    		done()
	    	})
	    	.catch( done )
	    });
  	});
	
	describe('incr string1', function() {
	    it('should return WRONGTYPE error', function( done ) {
	    	redis.incr('string1')
	    	.then( function(r){	    		
	    		done("no error returned")
	    	})
	    	.catch( (err) => {
	    		done()
	    	})
	    });
  	});

	describe('get string1', function() {
	    it('should return toto', function( done ) {
	    	redis.get('string1')
	    	.then( function(r){
	    		assert.equal(r, 'toto');
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

	describe('get string2', function() {
	    it('should return null', function( done ) {
	    	redis.get('string2')
	    	.then( function(r){
	    		assert.equal(r, null);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

	describe('del string1', function() {
	    it('should return 1', function( done ) {
	    	redis.del('string1')
	    	.then( function(r){
	    		assert.equal(r, 1);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});


	describe('get string1', function() {
	    it('should return null', function( done ) {
	    	redis.get('string1')
	    	.then( function(r){
	    		assert.equal(r, null);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

	describe('incr int1', function() {
	    it('should return 1', function( done ) {
	    	redis.incr('int1')
	    	.then( function(r){	    
	    		assert.equal(r, 1);		
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('incr int1', function() {
	    it('should return 1', function( done ) {
	    	redis.incr('int1')
	    	.then( function(r){	    
	    		assert.equal(r, 2);		
	    		done()
	    	})
	    	.catch( done )
	    });
  	});
});

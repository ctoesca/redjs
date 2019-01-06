const Redjs = require('..');
const Redis = require('ioredis');
const assert = require('assert');

describe('Connect Events', function() 
{
	
	var redis

	describe('connect', function() {
	    it('should receive "connect" event', function( done ) {
	    	
	    	var onEvent = function(r){	    		
	    		redis.removeListener('connect', onEvent)
	    		done()
	    	}
	    	redis = getRedis().on('connect', onEvent)	

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



	describe('ping', function() {
	    it('should receive "PONG"', function( done ) {	    	
	    	redis.ping()
	    	.then( function(r){
	    		assert.equal(r, "PONG");
	    		done()
	    	})
	    });
  	});


	describe('ping toto', function() {
	    it('should receive "toto"', function( done ) {	    	
	    	redis.ping("toto")
	    	.then( function(r){
	    		assert.equal(r, "toto");
	    		done()
	    	})
	    });
  	});


	describe('select 1', function() {
	    it('should receive "OK"', function( done ) {	    	
	    	redis.select(1)
	    	.then( function(r){
	    		assert.equal(r, "OK");
	    		done()
	    	})
	    });
  	});

	describe('select DB without index', function() {
	    it('should receive error', function( done ) {	    	
	    	redis.select()
	    	.then( function(r){   		
	    		done("Receive response " + r)
	    	})
	    	.catch( (err) => {
	    		done()
	    	})
	    });
  	});


	describe('auth pass', function() {
	    it('should receive "OK"', function( done ) {	    	
	    	redis.auth('pass')
	    	.then( function(r){
	    		assert.equal(r, "OK");
	    		done()
	    	})
	    });
  	});

	describe('auth without password', function() {
	    it('should receive error', function( done ) {	    	
	    	redis.auth()
	    	.then( function(r){   		
	    		done("Receive response " + r)
	    	})
	    	.catch( (err) => {
	    		done()
	    	})
	    });
  	});

  	describe('quit', function() {
	    it('should receive OK', function( done ) {	    	
	    	redis.quit()
	    	.then( function(r){
	    		assert.equal(r, "OK");
	    		done()
	    	})
	    });
  	});


  	

});

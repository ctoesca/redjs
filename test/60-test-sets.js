
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

  	/* spop */
  	describe('sadd set2 bla1', function() {
	    it('should return 1', function( done ) {
	    	redis.sadd('set2','bla1')
	    	.then( function(r){
	    		assert.equal(r, 1 );
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('sadd set2 bla2', function() {
	    it('should return 1', function( done ) {
	    	redis.sadd('set2','bla2')
	    	.then( function(r){
	    		assert.equal(r, 1 );
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('sadd set2 bla3', function() {
	    it('should return 1', function( done ) {
	    	redis.sadd('set2','bla3')
	    	.then( function(r){
	    		assert.equal(r, 1 );
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('spop set2', function() {
	    it('should return [bla*]', function( done ) {
	    	redis.spop('set2')
	    	.then( function(r){
	    		if ((typeof r != 'object')&&(typeof r.push != 'function'))
	    			assert.fail('result is not array: '+JSON.stringify(r))
	    		assert.equal(r.length, 1 );
	    		if (r[0].indexOf('bla') != 0)
	    			assert.fail('wrong result: '+JSON.stringify(r))
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('smembers set2', function() {
	    it('should return array with length=2', function( done ) {
	    	redis.smembers('set2')
	    	.then( function(r){
	    		assert.equal(r.length, 2 );
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('spop set2 2', function() {
	    it('should return [bla*, bla*]', function( done ) {
	    	redis.spop('set2',2)
	    	.then( function(r){
	    		if ((typeof r != 'object')&&(typeof r.push != 'function'))
	    			assert.fail('wrong result: '+JSON.stringify(r))
	    		assert.equal(r.length, 2 );
	    		if (r[0].indexOf('bla') != 0)
	    			assert.fail('wrong result: '+JSON.stringify(r))
	    		if (r[1].indexOf('bla') != 0)
	    			assert.fail('wrong result: '+JSON.stringify(r))
	    		done()
	    	})
	    	.catch( done )
	    });
  	});


  	describe('spop set3', function() {
	    it('should return null', function( done ) {
	    	redis.spop('set3')
	    	.then( function(r){
	    		assert.equal(r, null );		
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('spop set2 toto', function() {
	    it('should return error', function( done ) {
	    	redis.spop('set3', 'toto')
	    	.then( function(r){
	    		done("no error: result = "+r)
	    	})
	    	.catch( err => {
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	/* sismember */
  	describe('sadd set4 var1 var2', function() {
	    it('should return 2', function( done ) {
	    	redis.sadd('set4', 'var1', 'var2')
	    	.then( function(r){
	    		assert.equal(r, 2);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('sismember set4 var1', function() {
	    it('should return 1', function( done ) {
	    	redis.sismember('set4', 'var1')
	    	.then( function(r){
	    		assert.equal(r, 1);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('sismember set4 toto', function() {
	    it('should return 1', function( done ) {
	    	redis.sismember('set4', 'toto')
	    	.then( function(r){
	    		assert.equal(r, 0);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('sismember set5 toto', function() {
	    it('should return 1', function( done ) {
	    	redis.sismember('set5', 'toto')
	    	.then( function(r){
	    		assert.equal(r, 0);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});


  	/* sunion */
  	describe('sadd set5 var1 var2', function() {
	    it('should return 2', function( done ) {
	    	redis.sadd('set5', 'var1', 'var2')
	    	.then( function(r){
	    		assert.equal(r, 2);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('sadd set6 var2 var3', function() {
	    it('should return 2', function( done ) {
	    	redis.sadd('set6', 'var2', 'var3')
	    	.then( function(r){
	    		assert.equal(r, 2);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});


  	describe('sunion set5 set6', function() {
	    it('should return [var1,var2,var3]', function( done ) {
	    	redis.sunion('set5', 'set6')
	    	.then( function(r){
	    		assert.deepEqual(r, ['var1','var2','var3']);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('sunion set6 set7', function() {
	    it('should return [var2,var3]', function( done ) {
	    	redis.sunion('set6', 'set7')
	    	.then( function(r){
	    		assert.deepEqual(r, ['var2','var3']);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('sunion set6', function() {
	    it('should return error', function( done ) {
	    	redis.sunion('set6')
	    	.then( function(r){
	    		done("no error: result = "+r)
	    	})
	    	.catch( err => {
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	
});

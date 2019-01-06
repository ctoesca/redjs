
const assert = require('assert');


describe('Hashes', function() 
{
	var redis = getRedis()
	/* HGET / HSET */
  	describe('hget key1 var1', function() {
	    it('should return null when the value is not present', function( done ) {
	    	redis.hget('key1', 'var1')
	    	.then( function(r){
	    		assert.equal(r, null);
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('hset key1 var1 toto', function() {
	    it('should return 1 when the value is set', function( done ) {
	    	redis.hset('key1', 'var1', 'toto')
	    	.then( function(r){
	    		assert.equal(r, 1); 
	    		done()
	    	})
	    	.catch( done )
	    });
	});

  	describe('hget key1 var1', function() {
	    it('should return "toto"', function( done ) {
	    	redis.hget('key1', 'var1')
	    	.then( function(r){
	    		assert.equal(r, "toto");
	    		done()
	    	})
	    	.catch( done )
	    });
  	});

  	describe('hset key1 var1 toto', function() {
	    it('should return 0 when the value is already set', function( done ) {
	    	redis.hset('key1', 'var1', 'toto')
	    	.then( function(r){
	    		assert.equal(r, 0)	
	    		done()
	    	})
	    	.catch( done )
	    	
	    });
	});

	describe('hset key1 var2 tutu', function() {
	    it('should return 1 when the value is set', function( done ) {
	    	redis.hset('key1', 'var2', 'tutu')
	    	.then( function(r){
	    		assert.equal(r, 1)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

  	/* HEXISTS */
	describe('hexists key1 var1', function() {
	    it('should return 1 when the value exists', function( done ) {
	    	redis.hexists('key1', 'var1')
	    	.then( function(r){
	    		assert.equal(r, 1)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});
  	describe('hexists key10 var1', function() {
	    it('should return 0 when the key does not exists', function( done ) {
	    	redis.hexists('key10', 'var1')
	    	.then( function(r){
	    		assert.equal(r, 0)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});
  	describe('hexists key1 var10', function() {
	    it('should return 0 when the field does not exist', function( done ) {
	    	redis.hexists('key1', 'var10')
	    	.then( function(r){
	    		assert.equal(r, 0)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

  	/* HDEL */

  	describe('hdel key1 var10', function() {
	    it('should return 0 when the field does not exist', function( done ) {
	    	redis.hdel('key1', 'var10')
	    	.then( function(r){
	    		assert.equal(r, 0)	
	    		done()
	    	})
	    	.catch( done )
	    	
	    });
	});

  	describe('hdel key10 var1', function() {
	    it('should return 0 when the key does not exist', function( done ) {
	    	redis.hdel('key10', 'var1')
	    	.then( function(r){
	    		assert.equal(r, 0)	
	    		done()
	    	})
	    	.catch( done )
	    	
	    });
	});

  	describe('hdel key1 var1 var2', function() {
	    it('should return 2 when the fields are removed', function( done ) {
	    	redis.hdel('key1', 'var1', 'var2')
	    	.then( function(r){
	    		assert.equal(r, 2)	
	    		done()
	    	})
	    	.catch( done )
	    	
	    });
	});

  	describe('hdel key1 var1 var2', function() {
	    it('should return 0 when the fields does not exist', function( done ) {
	    	redis.hdel('key1', 'var1', 'var2')
	    	.then( function(r){
	    		assert.equal(r, 0)	
	    		done()
	    	})
	    	.catch( done )
	    	
	    });
	});


  	/* HGETALL */
  	describe('hgetall key1', function() {
	    it('hgetall result should be empty', function( done ) {
	    	redis.hgetall('key1')
	    	.then( function(r){
	    		assert.deepEqual(r, [])	
	    		done()
	    	})
	    	.catch( done )
	    	
	    });
	});

	describe('hgetall key10', function() {
	    it('hgetall result should be empty if key does not exists', function( done ) {
	    	redis.hgetall('key10')
	    	.then( function(r){
	    		assert.deepEqual(r, [])	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

  	describe('hset key1 var1 toto', function() {
	    it('hgetall result should contains ["var1","toto","var2","tutu"]', function( done ) {
	    	redis.hset('key1', 'var1', 'toto')
	    	.then( function(r){
	    		return redis.hset('key1', 'var2', 'tutu')
	    	})	
	    	.then( function(r){
	    		return redis.hgetall('key1')
	    	})	    	
	    	.then( function(r){
	    		if (redis.isRedjs)
	    			assert.deepEqual(r, ["var1","toto","var2","tutu"])	//redjs
	    		else
	    			assert.deepEqual(r, {"var1":"toto","var2":"tutu"})	    //ioredis
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});


	/* HINCRBY */
	describe('hincrby key2 var1 202', function() {
	    it('hincrby result should be 202', function( done ) {
	    	redis.hincrby('key2', 'var1', 202)
	    	.then( function(r){
	    		assert.equal(r, 202)	
	    		done()
	    	})
	    	.catch( done )    	
	    });
	});
	describe('hincrby key2 var1 55', function() {
	    it('hincrby result should be 257', function( done ) {
	    	redis.hincrby('key2', 'var1', 55)
	    	.then( function(r){
	    		assert.equal(r, 257)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});



	/* HINCRBYFLOAT */
	describe('hincrbyfloat key2 var2 259.5', function() {
	    it('hincrbyfloat result should be 259.5', function( done ) {
	    	redis.hincrbyfloat('key2', 'var2', 259.5)
	    	.then( function(r){
	    		assert.equal(r, 259.5)	
	    		done()
	    	})
	    	.catch( done )
	    	
	    });
	});
	describe('hincrbyfloat key2 var2 33.3', function() {
	    it('hincrbyfloat result should be 292.8', function( done ) {
	    	redis.hincrbyfloat('key2', 'var2', 33.3)
	    	.then( function(r){
	    		assert.equal(r, 292.8)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});


	/* HKEYS */
	describe('hkeys key10', function() {
	    it('hkeys result should be empty array if key does not exist', function( done ) {
	    	redis.hkeys('key10')
	    	.then( function(r){
	    		assert.deepEqual(r, [])	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

	describe('hkeys key2', function() {
	    it('hkeys result should be ["var1","var2"]', function( done ) {
	    	redis.hkeys('key2')
	    	.then( function(r){
	    		assert.deepEqual(r, ["var1","var2"])	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

	
	/* HLEN */
	describe('hlen key10', function() {
	     it('hlen result should be 0 if key does not exist', function( done ) {
	    	redis.hlen('key10')
	    	.then( function(r){
	    		assert.deepEqual(r, 0)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

	describe('hlen key2', function() {
	     it('hlen result should be 2 ', function( done ) {
	    	redis.hlen('key2')
	    	.then( function(r){
	    		assert.deepEqual(r, 2)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});


	/* HMGET */

	describe('hmget key10 var1 var2 var3', function() {
	    it('hmget result should be [null, null, null] because key does not exist', function( done ) {
	    	redis.hmget('key10', 'var1', 'var2', 'var3')
	    	.then( function(r){
	    		assert.deepEqual(r, [null, null, null])	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});


	describe('hmget key1 var1 var2 var3', function() {
	    it('hmget result should be ["toto", "tutu", null]', function( done ) {
	    	redis.hmget('key1', 'var1', 'var2', 'var3')
	    	.then( function(r){
	    		assert.deepEqual(r,["toto", "tutu", null])	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});


	/* HMSET */
	describe('hmset key3 var1 toto var2 tutu', function() {
	    it('hmset result should be "OK"', function( done ) {
	    	redis.hmset('key3', 'var1', 'toto', 'var2', 'tutu')
	    	.then( function(r){
	    		assert.deepEqual(r,"OK")	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

	describe('hget key3 var1', function() {
	    it('hget result should be "toto"', function( done ) {
	    	redis.hget('key3', 'var1')
	    	.then( function(r){
	    		assert.deepEqual(r,"toto")	
	    		done()
	    	})
	    	.catch( done )    	
	    });
	});
	describe('hget key3 var2', function() {
	    it('hget result should be "tutu"', function( done ) {
	    	redis.hget('key3', 'var2')
	    	.then( function(r){
	    		assert.deepEqual(r,"tutu")	
	    		done()
	    	})
	    	.catch( done )    	
	    });
	});

	/* HSETNX */
	describe('hsetnx key4 var1 toto', function() {
	    it('hsetnx result should be 1 beacause key does not exist', function( done ) {
	    	redis.hsetnx('key4', 'var1', 'toto')
	    	.then( function(r){
	    		assert.equal(r,1)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});
	describe('hsetnx key4 var1 toto', function() {
	    it('hsetnx result should be 0 because key and field already exist', function( done ) {
	    	redis.hsetnx('key4', 'var1', 'toto')
	    	.then( function(r){
	    		assert.equal(r,0)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});
	describe('hsetnx key4 var2 toto', function() {
	    it('hsetnx result should be 1 because field does not exists', function( done ) {
	    	redis.hsetnx('key4', 'var1', 'toto')
	    	.then( function(r){
	    		assert.equal(r,0)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});
	describe('hsetnx key4 var1', function() {
	    it('hsetnx result should be "toto"', function( done ) {
	    	redis.hget('key4', 'var1')
	    	.then( function(r){
	    		assert.equal(r,'toto')	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

	/* HSTRLEN */
	describe('hstrlen key4 var1', function() {
	    it('hstrlen result should be 4', function( done ) {
	    	redis.hstrlen('key4', 'var1')
	    	.then( function(r){
	    		assert.equal(r,4)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

	describe('hstrlen key4 var10', function() {
	    it('hstrlen result should be 0 beacause field does not exist', function( done ) {
	    	redis.hstrlen('key5', 'var1')
	    	.then( function(r){
	    		assert.equal(r,0)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

	describe('hstrlen key5 var1', function() {
	    it('hstrlen result should be 0 beacause key does not exist', function( done ) {
	    	redis.hstrlen('key5', 'var1')
	    	.then( function(r){
	    		assert.equal(r,0)	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

	/* HVALS */
	describe('hvals key4', function() {
	    it('hvals result should be ["toto"]', function( done ) {
	    	redis.hvals('key4')
	    	.then( function(r){
	    		assert.deepEqual(r,['toto'])	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});

	describe('hvals key5', function() {
	    it('hvals result should be []', function( done ) {
	    	redis.hvals('key5')
	    	.then( function(r){
	    		assert.deepEqual(r,[])	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});


	/* HSCAN */
	/*describe('hscan key3 12 pattern', function() {
	    it('hscan result should be "OK"', function( done ) {
	    	redis.hscan('key3', 0 , 'count', 10, 'match', '*')
	    	.then( function(r){
	    		assert.deepEqual(r,"OK")	
	    		done()
	    	})
	    	.catch( done )	    	
	    });
	});*/


  	/*describe('END', function() {
	    it('process.exit', function( done ) {
	    	process.exit()
	    });
	});*/

		
});

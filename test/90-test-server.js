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

 
  describe('select 0', function() {
      it('should receive "OK"', function( done ) {        
        redis.select(0)
        .then( function(r){
          assert.equal(r, "OK");
          done()
        })
      });
  });

  describe('hset flushtest var1 testflush', function() {
      it('should return 1', function( done ) {
        redis.hset('key1', 'var1', 'toto')
        .then( function(r){
          assert.equal(r, 1);
          done()
        })
        .catch( done )
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

  describe('hset flushtest var1 testflush', function() {
      it('should return 1', function( done ) {
        redis.hset('key1', 'var1', 'toto')
        .then( function(r){
          assert.equal(r, 1);
          done()
        })
        .catch( done )
      });
  });

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

  describe('hget flushtest var1', function() {
      it('should return null', function( done ) {
        redis.hget('key1', 'var1')
        .then( function(r){
          assert.equal(r, null);
          done()
        })
        .catch( done )
      });
  });

    describe('flushall', function() {
      it('should return OK', function( done ) {
        redis.flushall()
        .then( function(r){
          assert.equal(r, "OK");
          done()
        })
        .catch( done )
      });
  });

   describe('select 0', function() {
      it('should receive "OK"', function( done ) {        
        redis.select(0)
        .then( function(r){
          assert.equal(r, "OK");
          done()
        })
      });
  });

  describe('hget flushtest var1', function() {
      it('should return null', function( done ) {
        redis.hget('key1', 'var1')
        .then( function(r){
          assert.equal(r, null);
          done()
        })
        .catch( done )
      });
  });



  describe('select toto', function() {
      it('should return error', function( done ) {
        redis.select('toto')
        .then( function(r){         
          done("no error returned")
        })
        .catch( (err) => {
          console.log(err.toString())
          done()
        })
      });
  }); 

  describe('select 1000', function() {
      it('should return error', function( done ) {
        redis.select(1000)
        .then( function(r){         
          done("no error returned")
        })
        .catch( (err) => {
          console.log(err.toString())
          done()
        })
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

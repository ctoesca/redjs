
const assert = require('assert');


describe('PubSub', function() 
{
	var redis1 = getRedis()
	var redis2 = getRedis()

	describe('check subscribe/publish / removelister', function() {
	    it('should receive message from channel.toto', function( done ) {
	    	this.timeout(5000);
	    	var received = false
	    	var onMessage1 = function(channel, msg){
	    		assert.equal(msg, "message from "+channel);
	    		received = true
	    	}
	    	redis1.on('message', onMessage1)

	    	redis1.subscribe('channel.toto')
	    	.then( function(r){	    
	    		
	    		return redis2.publish('channel.toto', 'message from channel.toto') 
	    		.then( function(r){
	    			assert.equal(r, 1 )		
	    		})
	    	})
	    	.delay( 1000 )
	    	.then( () => {
	    		redis1.removeListener('message', onMessage1)

	    		if (!received){
	    			done("Le message n'a pas été reçu en 1 sec")
	    		}else{
	    			return redis2.publish('channel.toto', 'this message is received after calling redis.removeListener("message"...)') 
	    		}	    		
	    	})
	    	.delay( 1000 )
	    	.then( () => {
	    		done()
	    	})
	    	.catch( done )
	    });
  	});


	describe('check unsubscribe/publish channel.toto', function() {
		
		this.timeout(5000);

	    it('should not return message from channel.toto', function( done ) {
	    	var received = false
	    	var onMessage2 = function(channel, msg){
	    		console.log("2 - RECEIVED MESSAGE '"+msg+"' from channel "+channel)
	    		received = true
	    		done("this message from channel '"+channel+"' is received after unsubscribe")
	    	}
	    	redis1.on('message', onMessage2)

	    	redis1.unsubscribe('channel.toto') 	
	    	.then( function(r){
	    		return redis2.publish('channel.toto', 'message from channel.toto2222') 		    		
	    	})  	
	    	.then( function(r){
	    		assert.equal(r, 0 )
	    	})	    	
	    	.delay( 1000 )
	    	.then(function(){
	    		redis1.removeListener('message', onMessage2)
	    		done()
	    	})
	    	.catch( done )
	    });
  	});


	describe('psubscribe channel.* / publish', function() {
		
	    it('should receive message from channel.tutu and channel.toto', function( done ) {

	    	var received = []
	    	var onMessage3 = function(channel, msg){
	    		if ((msg == "message from channel.tutu")||(msg == "message from channel.toto")){
	    			console.log("3 - RECEIVED MESSAGE '"+msg+"' from channel "+channel)
	    			received.push(msg)
	    		}
	    	}
	    	redis1.on('message', onMessage3)	

	    	redis1.psubscribe('channel.*') 	
	    	.then( function(r){
	    		
	    		redis2.publish('channel.tutu', 'message from channel.tutu') 
	    		.then(function(r){
	    			console.log("3 - PUBLISH channel.tutu to "+r+" clients")
	    		})

	    		redis2.publish('channel.toto', 'message from channel.toto') 
	    		.then(function(r){
	    			console.log("3 - PUBLISH channel.toto to "+r+" clients")
	    		})
	    	})
	    	.delay(1000)
	    	.then(()=>{
	    		redis1.removeListener('message', onMessage3)	
	    		if (received.length != 2){	    				    		
		    		done("Les 2 messages n'ont pas étté reçus en 1 sec")
	    		}else{
	    			done()
	    		}
	    	})
	    	.catch( done )
	    });
  	});


});

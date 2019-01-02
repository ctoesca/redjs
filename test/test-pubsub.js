const Redjs = require('..');
const redjs = new Redjs()
const assert = require('assert');

describe('PubSub', function() 
{

	describe('check subscribe/publish / removelister', function() {
	    it('should receive message from channel.toto', function( done ) {
	    	this.timeout(5000);
	    	var received = false
	    	var onMessage1 = function(channel, msg){
	    		assert.equal(msg, "message from "+channel);
	    		received = true
	    	}
	    	redjs.on('message', onMessage1)

	    	redjs.subscribe('channel.toto')
	    	.then( function(r){	    
	    		
	    		return redjs.publish('channel.toto', 'message from channel.toto') 
	    		.then( function(r){
	    			assert.equal(r, 1 )		
	    		})
	    	})
	    	.delay( 1000 )
	    	.then( () => {
	    		redjs.off('message', onMessage1)

	    		if (!received){
	    			done("Le message n'a pas été reçu en 1 sec")
	    		}else{
	    			return redjs.publish('channel.toto', 'this message is received after calling redjs.off("message"...)') 
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
	    	redjs.on('message', onMessage2)

	    	redjs.unsubscribe('channel.toto') 	
	    	.then( function(r){
	    		return redjs.publish('channel.toto', 'message from channel.toto2222') 		    		
	    	})  	
	    	.then( function(r){
	    		assert.equal(r, 0 )
	    	})	    	
	    	.delay( 1000 )
	    	.then(function(){
	    		redjs.off('message', onMessage2)
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
	    	redjs.on('message', onMessage3)	

	    	redjs.psubscribe('channel.*') 	
	    	.then( function(r){
	    		
	    		redjs.publish('channel.tutu', 'message from channel.tutu') 
	    		.then(function(r){
	    			console.log("3 - PUBLISH channel.tutu to "+r+" clients")
	    		})

	    		redjs.publish('channel.toto', 'message from channel.toto') 
	    		.then(function(r){
	    			console.log("3 - PUBLISH channel.toto to "+r+" clients")
	    		})
	    	})
	    	.delay(1000)
	    	.then(()=>{
	    		redjs.off('message', onMessage3)	
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

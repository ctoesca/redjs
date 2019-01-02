const Redjs = require('..');
const assert = require('assert');

describe('Connect Events', function() 
{

	describe('connect', function() {
	    it('should receive "connect" event', function( done ) {
	    	
	    	var redjs = new Redjs()

	    	var onEvent = function(r){	    		
	    		redjs.off('connect', onEvent)
	    		assert.equal(r, "OK"); 
	    		done()
	    	}

	    	redjs.on('connect', onEvent)	
	    });
  	});


	/*describe('connect error', function() {
	    it('should receive "error" event', function( done ) {
	    	
	    	var redjs = new Redjs()

	    	var onEvent = function(err){	    		
	    		redjs.off('error', onEvent)
	    		done()
	    	}

	    	redjs.on('error', onEvent)	
	    });
  	});*/




});

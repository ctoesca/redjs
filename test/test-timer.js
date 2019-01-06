
const assert = require('assert');
const utils = require('../dist/utils')
const Promise = require('bluebird');

describe('Timer', function() 
{
	var timer = new utils.Timer({delay: 1000})
	
  	describe('timer event after 1 sec', function() {

	    it('should emit timer event', function( done ) {

	    	var timerEvent = function(){
  				timer.removeListener(utils.Timer.ON_TIMER, timerEvent)
  				done()
  			}

	    	timer.on(utils.Timer.ON_TIMER, timerEvent)
  			timer.start()

	    });
  	});


  	describe('reset timer', function() {

	    it('should emit timer event', function( done ) {

	    	var timerEvent = function(){
  				timer.removeListener(utils.Timer.ON_TIMER, timerEvent)
  				done()
  			}
	    	timer.on(utils.Timer.ON_TIMER, timerEvent)
  			timer.reset()

	    });
  	});

  	describe('timer stopper: no event', function() {
	    it('should not emit timer event', function( done ) {
	    	this.timeout(5000);
	    	

	    	var timerEvent = function(){
  				timer.removeListener(utils.Timer.ON_TIMER, timerEvent)
  				done("Timer send event but is stopped")
  			}
	    	timer.on(utils.Timer.ON_TIMER, timerEvent)
	    	timer.stop()

	    	setTimeout( () => {
	    		done()
	    	}, 2000)

	    });
  	});

  	describe('destroy and start timer', function() {

	    it('should not emit timer event', function( done ) {
	    	
	    	this.timeout(5000);

	    	var timerEvent = function(){
  				timer.removeListener(utils.Timer.ON_TIMER, timerEvent)
  				done("Timer send event but is destroyed")
  			}
  			timer.on(utils.Timer.ON_TIMER, timerEvent)
	    	timer.destroy()
  			timer.start()

  			setTimeout( () => {
	    		done()
	    	}, 2000)


	    });
  	});


});

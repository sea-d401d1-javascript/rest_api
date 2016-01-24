var express = require('express');
var Hero = require(__dirname + '/../models/hero');
var Villain = require(__dirname + '/../models/villain');
var handleError = require(__dirname + '/../lib/handleServerError');
var EE = require('events').EventEmitter;

var ee = new EE();

var battleRouter = module.exports = exports = express.Router();

battleRouter.get('/battle', function(req, res) {
  var heroTotal;
  var villainTotal;

  //sum hero levels
  Hero.aggregate(
  	[
  	  {$group: {_id: null, total: {$sum: "$level"}}}
  	], function(err, res) {
          if(err) return handleError(err, res);
          heroTotal = res[0].total;
          console.log(heroTotal);
          ee.emit('hero complete');
  });

  //sum villain levels
  ee.on('hero complete', function() {
  	Villain.aggregate(
  	  [
  	    {$group: {_id: null, total: {$sum: "$level"}}}
  	  ], function(err, res) {
          if(err) return handleError(err, res);
          villainTotal = res[0].total;
          console.log(villainTotal);
          ee.emit('villain complete');
    });
  });

  //compare and send result
  ee.on('villain complete', function() {
    if(heroTotal > villainTotal) {
      res.send('Heroes win the Battle!');
    	res.end();
  	} else if (villainTotal > heroTotal) {
  		res.send('Villains win the Battle!');
  		res.end();
  	} else if (villainTotal === heroTotal) {
  		res.send('It was a tie!' + heroTotal + '...' + villainTotal);
  		res.end();
  	}
  });
});

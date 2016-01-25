var express = require('express');
var Hero = require(__dirname + '/../models/hero');
var Villain = require(__dirname + '/../models/villain');
var handleError = require(__dirname + '/../lib/handleServerError');
var battleRouter = module.exports = exports = express.Router();

battleRouter.get('/battle', function(req, res) {
  var heroTotal;
  var villainTotal;
  //sum hero levels
  var p1 = new Promise(
    function(resolve, reject) {
      Hero.aggregate(
        [
          {$group: {_id: null, total: {$sum: "$level"}}}
        ], function(err, data) {
          //if(err) return handleError(err, res);
          heroTotal = data[0].total;
          console.log(heroTotal);
          resolve(heroTotal);
          });
    });
  //sum villain levels after promise is fulfilled
  p1.then(
    Villain.aggregate(
            [
              {$group: {_id: null, total: {$sum: "$level"}}}
            ], function(err, data) {
                if(err) return handleError(err, res);
                  var villainTotal = data[0].total;
                  console.log(villainTotal);
                  if(heroTotal > villainTotal) {
                    res.send('Heroes win the Battle!');
                  } else if (villainTotal > heroTotal) {
                    res.send('Villains win the Battle!');
                  } else if (villainTotal === heroTotal) {
                    res.send('It was a tie!');
                  }
              })).catch(
                function(reason) {
                  console.log(reason);
                });
});
/*
battleRouter.get('/battle', function(req, res) {
  var heroTotal;
  var villainTotal;
  //sum hero levels
  Hero.aggregate(
  	[
  	  {$group: {_id: null, total: {$sum: "$level"}}}
  	], function(err, data) {
          if(err) return handleError(err, res);
          heroTotal = data[0].total;
          console.log(heroTotal);
          //sum villain levels
          Villain.aggregate(
  	        [
  	          {$group: {_id: null, total: {$sum: "$level"}}}
  	        ], function(err, data) {
                if(err) return handleError(err, res);
                  var villainTotal = data[0].total;
                  console.log(villainTotal);
                  if(heroTotal > villainTotal) {
                    res.send('Heroes win the Battle!');
  	              } else if (villainTotal > heroTotal) {
  		              res.send('Villains win the Battle!');
  	              } else if (villainTotal === heroTotal) {
  		              res.send('It was a tie!');
  	              }
          });
  });
});
*/
//Below is an alternate solution using event emitters.

/*
var EE = require('events').EventEmitter;

battleRouter.get('/battle', function(req, res) {
  var ee = new EE();
  var heroTotal;
  var villainTotal;

  //sum hero levels
  Hero.aggregate(
  	[
  	  {$group: {_id: null, total: {$sum: "$level"}}}
  	], function(err, data) {
          if(err) return handleError(err, res);
          heroTotal = data[0].total;
          console.log(heroTotal);
          ee.emit('hero complete');
  });

  //sum villain levels
  ee.on('hero complete', function() {
  	Villain.aggregate(
  	  [
  	    {$group: {_id: null, total: {$sum: "$level"}}}
  	  ], function(err, data) {
          if(err) return handleError(err, res);
          villainTotal = data[0].total;
          console.log(villainTotal);
          ee.emit('villain complete');
    });
  });

  //compare and send result
  ee.on('villain complete', function() {
    if(heroTotal > villainTotal) {
      res.send('Heroes win the Battle!');
    	//res.end();
  	} else if (villainTotal > heroTotal) {
  		res.send('Villains win the Battle!');
  		//res.end();
  	} else if (villainTotal === heroTotal) {
  		res.send('It was a tie!' + heroTotal + '...' + villainTotal);
  		//res.end();
  	}
  });
});

*/





var express = require('express');
var bodyParser = require('body-parser');
var Hero = require(__dirname + '/../models/hero');
var Villain = require(__dirname + '/../models/villain');
var handleError = require(__dirname + '/../lib/handleServerError');

var battleRouter = module.exports = exports = express.Router();

battleRouter.get('/battle', function(req, res) {

  //sum hero levels and assign to array
  var heroTotalArray = Hero.aggregate(
  	[
  	  {$group: {_id: null, total: {$sum: "$level"}}}
  	]
  ).toArray();

  //sum villain levels and assign to array
  var villainTotalArray = Villain.aggregate(
  	[
  	  {$group: {_id: null, total: {$sum: "$level"}}}
  	]
  ).toArray();

  //get total for heroes and villains our of arrays
  var heroTotal = heroTotalArray[1].total;
  var villainTotal = villainTotalArray[1].total;

  //send a response with the winner

  if(err) return handleError(err, res);

  if(heroTotal > villainTotal) {
    res.send('Heroes win the Battle!');
    res.end();
  } else if (villainTotal > heroTotal) {
  	res.send('Villains win the Battle!');
  	res.end();
  } else if (villainTotal === heroTotal) {
  	res.send('It was a tie!');
  	res.end();
  }
});

var express = require('express');
var bodyParser = require('body-parser');
var Hero = require(__dirname + '/../models/hero');
var handleError = require(__dirname + '/../lib/handleServerError');

var heroesRouter = module.exports = exports = express.Router();

heroesRouter.post('/heroes', bodyParser.json(), function(req, res) {
  var newHero = new Hero(req.body);
  newHero.save(function(err, data) {
    if(err) return handleError(err, res);

    res.json(data);
  });
});

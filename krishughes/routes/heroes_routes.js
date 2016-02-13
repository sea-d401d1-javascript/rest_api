var express = require('express');
var bodyParser = require('body-parser');
var Hero = require(__dirname + '/../models/hero');
var handleError = require(__dirname + '/../lib/handle_server_error');
var jwtAuth = require(__dirname + '/../lib/jwt_auth');

var heroesRouter = module.exports = exports = express.Router();

heroesRouter.get('/heroes', function(req, res) {
  Hero.find({}, function(err, data) {
    if(err) return handleError(err, res);
    res.json(data);
  });
});

heroesRouter.post('/heroes', bodyParser.json(), function(req, res) {
  var newHero = new Hero(req.body);
  newHero.save(function(err, data) {
    if(err) return handleError(err, res);

    res.json(data);
  });
});

heroesRouter.put('/heroes/:id', bodyParser.json(), function(req,res) {
  var heroData = req.body;
  delete heroData._id;
  Hero.update({_id: req.params.id}, heroData, function(err, data) {
    if(err) handleError(err, res);

    res.json({msg: 'success'});
  });
});

heroesRouter.delete('/heroes/:id', function(req, res) {
  Hero.remove({_id: req.params.id}, function(err) {
    if(err) return handleError(err, res);

    res.json({msg: 'success'});
  });
});



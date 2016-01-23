var express = require('express');
var bodyParser = require('body-parser');
var Villain = require(__dirname + '/../models/villain');
var handleError = require(__dirname + '/../lib/handleServerError');

var villainsRouter = module.exports = exports = express.Router();

villainsRouter.post('/villains', bodyParser.json(), function(req, res) {
  var newVillain = new Villain(req.body);
  newVillain.save(function(err, data) {
    if(err) return handleError(err, res);

    res.json(data);
  });
});

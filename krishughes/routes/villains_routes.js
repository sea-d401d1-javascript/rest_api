var express = require('express');
var bodyParser = require('body-parser');
var Villain = require(__dirname + '/../models/villain');
var handleError = require(__dirname + '/../lib/handleServerError');

var villainsRouter = module.exports = exports = express.Router();

villainsRouter.get('/villains', function(req, res) {
  Villain.find({}, function(err, data) {
    if(err) return handleError(err, res);
    res.json(data);
  });
});

villainsRouter.post('/villains', bodyParser.json(), function(req, res) {
  var newVillain = new Villain(req.body);
  newVillain.save(function(err, data) {
    if(err) return handleError(err, res);

    res.json(data);
  });
});

villainsRouter.put('/villains/:id', bodyParser.json(), function(req,res) {
  var villainData = req.body;
  delete villainData._id;
  Villain.update({_id: req.params.id}, villainData, function(err, data) {
    if(err) handleError(err, res);

    res.json({msg: 'success'});
  });
});

villainsRouter.delete('/villains/:id', function(req, res) {
  Villain.remove({_id: req.params.id}, function(err) {
    if(err) return handleError(err, res);

    res.json({msg: 'success'});
  });
});

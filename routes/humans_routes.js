'use strict';

const express = require('express');
const bodyParser = require('body-parser').json();
const Human = require(__dirname + '/../models/human');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const basicHTTP = require(__dirname + '/../lib/basic_http');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

var humanRouter = module.exports = exports = express.Router();

humanRouter.get('/allhumans', (req, res) => {
  Human.find({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

humanRouter.get('/myDog', jwtAuth, (req, res) => {
  Dog.find({walkedBy: req.user._id}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

humanRouter.post('/human', bodyParser, (req, res) => {
  var newHuman = new Human(req.body);
  newHuman.save((err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

humanRouter.put('/human/:id', bodyParser, (req, res) => {
  var humanData = req.body;
  delete humanData._id;
  Human.update({ _id: req.params.id }, humanData, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully updated human' });
  });
});

humanRouter.delete('/human/:id', (req, res) => {
  Human.remove({ _id: req.params.id }, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully deleted human' });
  });
});

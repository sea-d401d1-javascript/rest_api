'use strict';

const express = require('express');
const bodyParser = require('body-parser').json();
const Dog = require(__dirname + '/../models/dog');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const basicHTTP = require(__dirname + '/../lib/basic_http');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

var dogRouter = module.exports = exports = express.Router();

dogRouter.use(function login(req, res, next) {
  console.log('Database accessed at: ' + new Date() + '');
  next();
});

dogRouter.get('/alldogs', (req, res) => {
  Dog.find({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

dogRouter.get('/myHuman', (req, res) => {
  Human.count({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

// dogRouter.post('/dog', bodyParser, (req, res) => {
//   var newDog = new Dog(req.body);
//   newDog.save((err, data) => {
//     if (err) return handleDBError(err, res);
//
//     res.status(200).json(data);
//   });
// });

dogRouter.put('/dog/:id', bodyParser, (req, res) => {
  var dogData = req.body;
  delete dogData._id;
  Dog.update({ _id: req.params.id }, dogData, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully updated dog' });
  });
});

dogRouter.delete('/dog/:id', (req, res) => {
  Dog.remove({ _id: req.params.id }, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully deleted dog' });
  });
});

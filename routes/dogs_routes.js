'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const Dog = require(__dirname + '/../models/dog');
const handleDBError = require(__dirname + '/../lib/handle_db_error');

var dogRouter = module.exports = exports = express.Router();

dogRouter.get('/dogs', (req, res) => {
  Dog.find({}, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

dogRouter.post('/dogs', jsonParser, (req, res) => {
  var newDog = new Dog(req.body);
  newDog.save((err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

dogRouter.put('/dogs/:id', jsonParser, (req, res) => {
  var dogData = req.body;
  delete dogData._id;
  Dog.update({ _id: req.params.id }, dogData, (err) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

dogRouter.delete('/dogs/:id', (req, res) => {
  Dog.remove({ _id: req.params.id }, (err) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

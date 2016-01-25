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

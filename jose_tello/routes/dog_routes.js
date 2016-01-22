const express = require('express');
const Dog = require(__dirname + '/../app/models/dog');
const errorHandler = require(__dirname + '/../lib/error_handler');

var dogRouter = module.exports = exports = express.Router();

dogRouter.get('/dogs', (req, res) => {
  Dog.find({}, (err, data) => {
    if (err) return errorHandler(err);
    res.status(200).json(data);
  });
});

dogRouter.post('/dogs', (req, res) => {
  var newDog = new Dog(req.body);
  Dog.save((err, data) => {
    if (err) return errorHandler(err);
    res.status(200).json(data);
  });
});

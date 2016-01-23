const express = require('express');
const random = require('mongoose-random');
const errorHandler = require(__dirname + '/../lib/error_handler');
const Cat = require(__dirname + '/../app/models/cat');
const Dog = require(__dirname + '/../app/models/dog');

var randomizer = module.exports = exports = express.Router();

randomizer.get('/cats', (req, res) => {
  Cat.findRandom().limit(1).exec((err, doc) => {
    res.status(200).json(doc);
  });
});
// Dog.findRandom().limit(1).exec((err, res) => {
//   res.status(200).json(doc);
// });

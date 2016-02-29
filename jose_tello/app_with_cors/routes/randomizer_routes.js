const express = require('express');
const jsonParser = require('body-parser').json();
const Dog = require(__dirname + '/../models/dog');
const Cat = require(__dirname + '/../models/cat');
const handleDBError = require(__dirname + '/../lib/handle_db_error');

var randomizerRouter = module.exports = exports = express.Router();

randomizerRouter.get('/randomizer/cats', (req, res) => {
  Cat.findRandom().limit(1).exec((err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

randomizerRouter.get('/randomizer/dogs', (req, res) => {
  Dog.findRandom().limit(1).exec((err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

const express = require('express');
const jsonParser = require('body-parser').json();
const Cat = require(__dirname + '/../models/cat');
const handleDBError = require(__dirname + '/../lib/handle_db_error');

var catRouter = module.exports = exports = express.Router();

catRouter.get('/cats', (req, res) => {
  Cat.find({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});
catRouter.post('/cats', jsonParser, (req, res) => {
  var newCat = new Cat(req.body);
  newCat.save((err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

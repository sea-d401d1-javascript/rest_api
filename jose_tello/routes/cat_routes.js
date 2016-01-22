const express = require('express');
const Cat = require(__dirname + '/../app/models/cat');
const errorHandler = require(__dirname + '/../lib/error_handler');

var catRouter = module.exports = exports = express.Router();

catRouter.get('/cats', (req, res) => {
  Cat.find({}, (err, data) => {
    if (err) return errorHandler(err);
    res.status(200).json(data);
  });
});

catRouter.post('/cats', (req, res) => {
  var newCat = new Cat(req.body);
  Cat.save((err, data) => {
    if (err) return errorHandler(err);
    res.status(200).json(data);
  });
});

const express = require('express');
const jsonParser = require('body-parser').json();
const Cat = require(__dirname + '/../models/cat');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

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
catRouter.put('/cats/:id', jsonParser, (req, res) => {
  var catsData = req.body;
  delete catsData._id;

  Cat.update({ _id: req.params.id }, catsData, err => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'success' });
  });
});
catRouter.delete('/cats/:id', (req, res) => {
  Cat.remove({ id: req.params.id }, err => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'success' });
  });
});

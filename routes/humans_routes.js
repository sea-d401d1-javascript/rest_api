'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const Dog = require(__dirname + '/../models/humans');
const handleDBError = require(__dirname + '/../lib/handle_db_error');

var humanRouter = module.exports = exports = express.Router();

humanRouter.get('/humans', (req, res) => {
  Human.find({}, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

humanRouter.post('/humans', jsonParser, (req, res) => {
  var newHuman = new Human(req.body);
  newHuman.save((err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

humanRouter.put('/humans/:id', (req, res) => {
  var humanData = req.body;
  delete humanData._id;
  Human.update({ _id: req.params.id }, humanData, (err) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

humanRouter.delete('/humans/:id', (req, res) => {
  Human.remove({ _id: req.params.id }, (err) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

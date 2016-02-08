'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const Human = require(__dirname + '/../models/human');
const handleDBError = require(__dirname + '/../lib/handle_db_error');

var humanRouter = module.exports = exports = express.Router();

humanRouter.get('/human', (req, res) => {
  Human.find({}, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

humanRouter.post('/human', jsonParser, (req, res) => {
  var newHuman = new Human(req.body);
  newHuman.save((err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

humanRouter.put('/human/:id', (req, res) => {
  var humanData = req.body;
  delete humanData._id;
  Human.update({ _id: req.params.id }, humanData, (err) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

humanRouter.delete('/human/:id', (req, res) => {
  Human.remove({ _id: req.params.id }, (err) => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

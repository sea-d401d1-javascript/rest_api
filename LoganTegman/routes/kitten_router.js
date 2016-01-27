'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const Kitten = require(__dirname + '/../models/kitten');
const handleDBError = require(__dirname + '/../lib/handleDBError');

const kittenRouter = module.exports = exports = express.Router();

kittenRouter.get('/kittens', (req, res) => {
  Kitten.find({}, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

kittenRouter.post('/kittens', jsonParser, (req, res) => {
  const newKitten = new Kitten(req.body);
  newKitten.save((err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

kittenRouter.put('/kittens/:id', jsonParser, (req, res) => {
  const kittenData = req.body;
  delete kittenData._id;

  Kitten.update({ _id: req.params.id }, kittenData, err => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

kittenRouter.delete('/kittens/:id', (req, res) => {
  Kitten.remove({ _id: req.params.id }, err => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

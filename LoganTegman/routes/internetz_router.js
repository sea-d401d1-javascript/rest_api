'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const Internetz = require(__dirname + '/../models/internetz');
const handleDBError = require(__dirname + '/../lib/handleDBError');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

const internetzRouter = module.exports = exports = express.Router();

internetzRouter.get('/internetz', (req, res) => {
  Internetz.find({}, (err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

internetzRouter.post('/internetz', jwtAuth, jsonParser, (req, res) => {
  const newInternetz = new Internetz(req.body);
  newInternetz.save((err, data) => {
    if (err) return handleDBError(err, res);

    res.status(200).json(data);
  });
});

internetzRouter.put('/internetz/:id', jwtAuth, jsonParser, (req, res) => {
  const kittenData = req.body;
  delete kittenData._id;

  Internetz.update({ _id: req.params.id }, kittenData, err => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

internetzRouter.delete('/internetz/:id', jwtAuth, (req, res) => {
  Internetz.remove({ _id: req.params.id }, err => {
    if (err) return handleDBError(err, res);

    res.status(200).json({ msg: 'success' });
  });
});

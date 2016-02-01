'use strict';

const express = require('express');
const Kitten = require(__dirname + '/../models/kitten');
const Internetz = require(__dirname + '/../models/internetz');
const handleDBError = require(__dirname + '/../lib/handleDBError');

const ratioRouter = module.exports = exports = express.Router();

ratioRouter.get('/ratio', (req, res) => {
  Promise.all([Kitten.find({}).exec(), Internetz.find({}).exec()])
    .then(data => {
      res.status(200).json({ 'KPIratio': data[0].length / data[1].length });
    })
    .catch(err => handleDBError(err, res));
});

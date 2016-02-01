'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const Flower = require(__dirname + '/../models/flower');
const Gardener = require(__dirname + '/../models/gardener');
const handleError = require(__dirname + '/../lib/errorHandler');

var nonCrudRouter = module.exports = exports = express.Router();

nonCrudRouter.get('/howManyFlowers', (req, res) => {
  var gardeners = new Promise((resolve) => {
    Gardener.count({}, (err, data) => {
     if (err) return handleError(err, res);
    resolve(data); 
    });
  });
  var flowers = new Promise((resolve) => {
    Flower.count({}, (err, data) => {
     if (err) return handleError(err, res);
    resolve(data); 
    });
  });
  Promise.all([gardeners, flowers]).then((vals) => {
    res.send('With the gardeners on hand we can potentially grow ' + (vals[0] * vals[1]) + ' flowers.');
  });
});

'use strict';

const express = require('express');
const jsonParser = require('body-parser').json();
const Flower = require(__dirname + '/../models/flower');
const handleError = require(__dirname + '/../lib/errorHandler');
const jwtAuth = require(__dirname + '/../lib/jwtAuth');

var flowerRouter = module.exports = exports = express.Router();
// get all flowers
flowerRouter.get('/flowers', (req, res) => {
  Flower.find({}, (err, data) => {
    if (err) return handleError(err, res);
    res.status(200).json(data);
  });
});
//get just my flowers
flowerRouter.get('/myflowers', jwtAuth, (req, res) => {
  Flower.find({ planter: req.user._id }, (err, data) => {
    if (err) return handleError(err, res);
    res.status(200).json(data);
  });
});
//post to whole db
flowerRouter.post('/flowers', jsonParser, (req, res) => {
  var newFlower = new Flower(req.body);
  newFlower.save((err, data) => {
    if (err) return handleError(err, res);
    res.status(200).json(data);
  });
});
//post just to my flowers
flowerRouter.post('/myflowers', jwtAuth, jsonParser, (req, res) => {
  var newFlower = new Flower(req.body);
  newFlower.planter = req.user._id;
  newFlower.save((err, data) => {
    if (err) return handleError(err, res);    
    res.status(200).json(data);
  });
});
//delete from whole db
flowerRouter.delete('/flowers/:id', (req, res) => {
  Flower.remove({_id: req.params.id}, (err) => {
    if (err) return handleError(err, res);
    res.status(200).json({msg: 'success'});
  });
});
//put to update an entry in the whole db
flowerRouter.put('/flowers/:id', jsonParser, (req, res) => {
  var updateFlowerData = req.body;
  delete updateFlowerData._id;
  Flower.update({_id: req.params.id}, updateFlowerData, (err) => {
    if (err) return handleError(err, res);
    res.status(200).json(updateFlowerData);
  });
});

'use strict';

const express = require('express');
const User = require(__dirname + '/../models/user');
const jsonParser = require('body-parser').json();
const errorHandler = require(__dirname + '/../lib/errorHandler');
const basicHTTP = require(__dirname + '/../lib/basicHTTP');
const unique = require(__dirname + '/../lib/uniqueUsername');

var authRouter = module.exports = exports = express.Router();

authRouter.post('/signup', jsonParser, unique, (req, res) => {
  if (!((req.body.email || '').length && (req.body.password || '').length > 7)) {
    return res.status(400).json({msg: 'invalid username or password'});
  }
  var newUser = new User();
  newUser.username = req.body.username || req.body.email;
  newUser.authentication.email = req.body.email;
  newUser.hashPassword(req.body.password);
  newUser.save((err, data) => {
    if (err) return errorHandler(err, res);
    res.json({token: data.generateToken()});
  });
});

authRouter.get('/signin', basicHTTP, (req, res) => {
  User.findOne({'authentication.email': req.basicHTTP.email}, (err, user) => {
    if (err){
      console.log(err);
      return res.status(400).json({msg: 'you are not authentic, dude'});
    }
    if (!user) return res.status(400).json({msg: 'you are not authentic, dude'});
    if (!user.comparePassword(req.basicHTTP.password)) {
      return res.status(400).json({msg: 'you are not authentic, dude'});
    }
    res.json({ token: user.generateToken() });
  });
});

'use strict';

const express = require('express');
const bodyParser = require('body-parser').json();
const validator = require('validator');
const User = require(__dirname + '/../models/user');
const handleDBError = require(__dirname + '/../lib/handleDBError');
const basicHTTP = require(__dirname + '/../lib/basic_http');

const userRouter = module.exports = exports = express.Router();

userRouter.post('/signup', bodyParser, (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  if (!email || password.length < 6 || !validator.isEmail(email)) {
    return res.status(400).json({ msg: 'invalid username or password' });
  }

  User.findOne({ 'authentication.email': email }, (err, user) => {
    if (err) return handleDBError(err, res);

    if (user) return res.status(400).json({ msg: 'email already used' });

    const newUser = new User();

    newUser.username = req.body.username || email;
    newUser.authentication.email = email;
    newUser.hashPassword(password);
    newUser.save((err, data) => {
      if (err) return handleDBError(err, res);
      res.status(200).json({ token: data.generateToken() });
    });
  });
});

userRouter.get('/signin', basicHTTP, (req, res) => {
  const password = req.basicHTTP.password;
  const email = req.basicHTTP.email;

  User.findOne({ 'authentication.email': email }, (err, user) => {
    if (err) return handleDBError(err, res);
    if (!user) return res.status(401).json({ msg: 'user does not exist' });
    if (!user.comparePassword(password)) {
      return res.status(401).json({ msg: 'incorrect password' });
    }

    res.status(200).json({ token: user.generateToken() });
  });
});

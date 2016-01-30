const express = require('express');
const jsonParser = require('body-parser').json();
const User = require(__dirname + '/../models/user');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const basicHTTP = require(__dirname + '/../lib/basic_http');
const userQuery = require(__dirname + '/../lib/user_query');
const mongoose = require('mongoose');

var authRouter = module.exports = exports = express.Router();

authRouter.post('/signup', jsonParser, userQuery, (req, res) => {
  var newUser = new User();
  newUser.username = req.body.username;
  newUser.authentication.email = req.body.email;
  newUser.hashPassword(req.body.password);
  newUser.save((err, data) => {
    debugger;
    if (err) return handleDBError(err, res);
    res.status(200).json({ token: data.generateToken() }); // to be replace with token
  });
});

authRouter.get('/signin', basicHTTP, (req, res) => {
  User.findOne({ 'authentication.email': req.basicHTTP.username }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(400).json({ msg: 'authenticat says no' });
    }
    if (!user) return res.status(401).json({ msg: 'authenticat says no' });
    if (!user.comparePassword(req.basicHTTP.password)) return res.status(401).json({ msg: 'authenticat says no' });
    res.json({ token: user.generateToken() });
  });
});

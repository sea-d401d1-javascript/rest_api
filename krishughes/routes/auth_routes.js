const express = require('express');
const User = require(__dirname + '/../models/user');
const jsonParser = require('body-parser').json();
const handleError = require(__dirname + '/../lib/handle_server_error');
const basicHTTP = require(__dirname + '/../lib/basic_http');

var authRouter = module.exports = exports = express.Router();

authRouter.post('/signup', jsonParser, (req, res) => {
  var newUser = new User();
  if(!((req.body.email || '').length && (req.body.password || '').length > 7)) {
    return res.status(400).json({msg: 'Invalid username or password'});
  }

  User.count({'authentication.email' : req.body.email}, function(err, count) {
    if(err) {
      console.log(err);
      return res.status(400).json({msg: 'Sorry'});
    }
    //Check if someone with this email is already signed up
    if (count > 0) {
      return res.status(401).json({msg: 'Account exists on this email'});
    }

    User.count({username: req.body.username}, function(err, countU) {
      if(err) {
        console.log(err);
        return res.status(400).json({msg: 'Sorry'});
      }
      //Check if username is taken
      if (countU > 0) {
        return res.status(401).json({msg: 'Username already exists'});
      }

      newUser.username = req.body.username || req.body.email;
      newUser.authentication.email = req.body.email;
      newUser.hashPassword(req.body.password);
      newUser.save((err, data) => {
        if(err) return handleError(err, res);
        res.status(200).json({token: data.generateToken()});
      });
    });
  });
});

authRouter.get('/signin', basicHTTP, (req, res) => {
  User.findOne({'authentication.email' : req.basicHTTP.email}, (err, user) => {
    if(err) {
      console.log(err);
      //Database error
      return res.status(401).json({msg: 'authenticat seyuzzz no!'});
    }
    //No User
    if(!user) return res.status(401).json({msg: 'no seyzz the authenticat'});
    //Password not matching
    if(!user.comparePassword(req.basicHTTP.password)) return res.status(401).json({msg: 'NO'});

    res.status(200).json({token: user.generateToken()});
  });
});


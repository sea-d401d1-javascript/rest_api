'use strict';

const User = require(__dirname + '/../models/user');

var email = module.exports.email = exports = function(emailAddress) {
  User.findOne({ 'authentication.email': emailAddress }, (err, user) => {
    if (err) return false;
    return !user;
  });
};

var username = module.exports.username = exports = function(name) {
  User.findOne({ username: name }, (err, user) => {
    if (err) return false;
    return !user;
  });
};

module.exports = exports = function(req, res, next) {
  if (email(req.body.email) && username(req.body.username || req.body.email) ) {
    return res.status(400).json({ msg: 'email or username already exists' });
  }
  next();
};

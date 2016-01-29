'use strict';

const User = require(__dirname + '/../models/user');

module.exports.email = exports = function(emailAddress) {
  User.findOne({ 'authentication.email': emailAddress }, (err, user) => {
    if (err) return false;
    return !user;
  });
};

module.exports.username = exports = function(name) {
  User.findOne({ username: name }, (err, user) => {
    if (err) return false;
    return !user;
  });
};

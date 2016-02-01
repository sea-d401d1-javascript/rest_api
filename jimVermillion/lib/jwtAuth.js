'use strict';

const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  var decoded;
  try {
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'changethis'); //eslint-disable-line
  } catch (e) {
    console.log(e);
    return res.status(401).json({ msg: 'you are not authentic, dude' });
  }
  User.findOne( { _id: decoded.id }, (err, user) => {
    if (err) return res.status(401).json({ msg: 'you are not authentic, dude' }); //eslint-disable-line
    if (!user) return res.status(401).json({ msg: 'you are not authentic, dude' }); //eslint-disable-line
    req.user = user;
    next();
  });
};

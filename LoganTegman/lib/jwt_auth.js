'use strict';

const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = (req, res, next) => {
  let decoded;
  try {
    let token = req.headers.Authentication.split(' ')[1];
    decoded =
      jwt.verify(token, process.env.APP_SECRET || 'changethis');
  } catch (e) {
    return res.status(401).json({ msg: 'could not authenticat' });
  }
  if (!decoded) res.status(401).json({ msg: 'could not authenticat' });

  User.findOne({ _id: decoded._id }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: 'DB error' });
    }
    if (!user) return res.status(401).json({ msg: 'authenticat says meow' });
    delete user.authentication.password;
    req.user = user;
    next();
  });
};

'use strict';

const zero = require(__dirname + '/zeroBuf');

module.exports = exports = function(req, res, next) {
  try {
    var authBuf = new Buffer(req.headers.authorization.split(' ')[1], 'base64'); //eslint-disable-line
    var authArr = authBuf.toString().split(':');

    zero(authBuf);

    if (authArr[0].length && authArr[1].length) {
      req.basicHTTP = {
        email: authArr[0],
        password: authArr[1]
      };
      return next();
    }
  } catch (err) {
    console.log(err);
  }
  res.status(401).json({ msg: 'you are not authentic, mang' });
};

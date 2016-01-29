'use strict';

module.exports = exports = (req, res, next) => {
  const authBuffer =
    new Buffer(req.headers.authorization.split(' ')[1], 'base64');
  const authArr = authBuffer.toString().split(':');
  authBuffer.fill(0);

  if (authArr && authArr[0] && authArr[1]) {
    req.basicHTTP = {
      email: authArr[0],
      password: authArr[1]
    };
    return next();
  }
  res.status(401).json({ msg: 'could not authenticat' });
};

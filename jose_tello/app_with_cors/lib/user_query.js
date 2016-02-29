const mongoose = require('mongoose');
const handleDBError = require(__dirname + '/handle_db_error');
const User = require(__dirname + '/../models/user');

module.exports = exports = function(req, res, next) {
  if (!((req.body.email || '').length && (req.body.password || '').length > 7)) {
    return res.status(400).json({ token: 'invalid username or password' });
  }
  User.findOne({ 'username': req.body.username }, (err, user) => {
    if (err) return handleDBError(err, res);
    if (user) return res.status(400).json({ msg: 'an account with this username already exists' });
    return next();
  });
};

const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  var decoded;
  try {
    var decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'changethis');
  } catch(e) {
    res.status(401).json({ msg: 'authenticat says no' });
  }
  User.findOne({ _id: decoded.id }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(401).json({ msg: 'authenticat says meow' });
    }
    if (!user) return res.status(401).json({ msg: 'authenticat says meow' });
    req.user = user;
    next();
  });
};

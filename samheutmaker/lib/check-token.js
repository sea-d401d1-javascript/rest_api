const User = require(__dirname + '/../models/blog').User;
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next){
  var decoded;
  try {
    decoded = jwt.verify(req.headers.token, process.env.TOKEN_SECRET || 'CHANGE_ME');
  } catch(e) {
    return res.status(400).json({
      msg: 'Error'
    });
  }
  User.findOne({_id: decoded.id}, (err, user) => {
    if(err || !user) {
      res.status(500).json({
        msg: 'Error'
      });
    }
    req.user = user;
    next();

  });
}

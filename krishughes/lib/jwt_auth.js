const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  var decoded;
  try {
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'changethis');
  } catch(e) {
    return res.status(401).json({msg: 'authenticat syzz mmmmmeow'});
  }
  User.findOne({_id: decoded.id}, (err, user) => {
    if(err) {
      console.log(err);
      return res.status(401).json({msg: 'authenticat syzzZZZ meow'});
    }
    if(!user) return res.status(401).json({msg: 'aaaaaaauthenticat syzz meow'});

    req.user = user;
    next();
  });
};

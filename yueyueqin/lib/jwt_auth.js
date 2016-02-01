const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req,res,next) {
  var decoded;
  try{
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'changethis');
  }catch(e){
    console.log(e);
    return res.status(401).json({msg:'invalid token'});
  }

  User.findOne({_id: decoded.id}, (err, user) => {
    if(err) {
      console.log(err);
      return res.status(500).json({msg: 'database error'});
    }

    if(!user) return res.status(401).json({msg:'no user exist'});

    req.user = user;
    next();
  });
};

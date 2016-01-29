const Donor = require(__dirname + '/../models/donor');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  var decoded;
  try {
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'changethis');
  } catch (e) {
    return res.status(401).json({msg: 'Error authenticating'});
  }

  if (!decoded) return res.status(401).json({msg: 'Could not authenticate'});

  Donor.findOne({_id: decoded.id}, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({msg: 'Database error'});
    }
    if (!user) return res.status(401).json({msg: 'User not found'});
    console.log(req.user);
    req.user = user;
    next();
  });
};

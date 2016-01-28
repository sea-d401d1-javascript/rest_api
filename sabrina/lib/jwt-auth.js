const Donor = require(__dirname + '/../models/donor');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  var decoded;
  try {
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'changethis');
  } catch(e) {
    return res.status(401).json({msg: 'Not authenticated'});
  }
  Donor.findOne({_id: decoded.id}, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({msg: 'Not authenticated'});
    }
    if (!user) return res.status(401).json({msg: 'Not authenticated'});
    req.user = user;
    next();
  });
};

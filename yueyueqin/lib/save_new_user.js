const User = require(__dirname + '/../models/user');
const handleError = require(__dirname + '/../lib/handle_error');

module.exports = exports = function(req,res) {
  var newUser = new User();
  newUser.username = req.body.username;
  newUser.authentication.email = req.body.email;
  newUser.authentication.password = newUser.hashPassword(req.body.password);
  newUser.save((err, data) => {
    if(err)  return handleError(err);
    console.log(data._id);
    return res.status(200).json({token: data.generateToken()});
  });

};

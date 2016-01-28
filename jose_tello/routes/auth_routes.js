const express = require('express');
const jsonParser = require('body-parser').json();
const User = require(__dirname + '/../models/user');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const basicHTTP = require(__dirname + '/../lib/basic_http');

var authRouter = module.exports = exports = express.Router();

authRouter.post('/signup', jsonParser, (req, res) => {
  var newUser = new User();
  if(!((req.body.email || '').length && (req.body.password || '').length > 7)) {
    return res.status(400).json({ token: 'invalid username or password' });
  }
  newUser.username = req.body.username || req.body.email;
  newUser.authentication.email = req.body.email;
  newUser.hashPassword(req.body.password);
  newUser.save((err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: data.generateToken() }); // to be replace with token
  });
});

authRouter.get('/signin', basicHTTP, (req, res) => {
  User.findOne({ 'authentication.email': req.basicHTTP.username }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(400).json({ msg: 'authenticat says no' });
    }
    if (!user) return res.status(401).json({ msg: 'authenticat says no' });
    if (!user.comparePassword(req.basicHTTP.password)) return res.status(401).json({ msg: 'authenticat says no' });
    res.json({ token: user.generateToken() });
  });
});

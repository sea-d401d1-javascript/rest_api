const express = require('express');
const jsonParser = require('body-parser').json();
const Donor = require(__dirname + '/../models/donor');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const basicHTTP = require(__dirname + '/../lib/basic-http');
const jwtAuth = require(__dirname + '/../lib/jwt-auth');

var donorRouter = module.exports = exports = express.Router();

donorRouter.use(function logIn(req, res, next) {
  console.log('Database accessed at: ' + (new Date()));
  next();
});

donorRouter.get('/donors', (req, res) => {
  Donor.find({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

donorRouter.get('/totalDonors', (req, res) => {
  Donor.count({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

donorRouter.get('/signin', basicHTTP, (req, res) => {
  Donor.findOne({'authentication.email': req.basicHTTP.email}, (err, user) => {
    if (err) return handleDBError(err, res);

    if (!user) return res.status(401).json({msg: 'User does not exist'});

    if (!user.comparePassword(req.basicHTTP.password)) return res.status(401).json({msg: 'Incorrect password'});

    res.json({token: user.generateToken()});
  });
});

donorRouter.post('/signup', jsonParser, (req, res) => {
  if (!(req.body.email || '').length) {
    return res.status(400).json({msg: 'Invalid email'});
  }

  if (!((req.body.password || '').length > 7)) {
    return res.status(400).json({msg: 'Please enter a password larger than 7 characters'});
  }

  Donor.findOne({'authentication.email': req.body.email}, (err, email) => {
    if (err) return handleDBError(err, res);
    if (email) return res.status(400).json({msg: 'Email taken - enter a new one'});

    var newDonor = new Donor();

    newDonor.username = req.body.username || req.body.email;
    newDonor.authentication.email = req.body.email;
    newDonor.hashPassword(req.body.password);
    newDonor.save((err, data) => {
      if (err) return handleDBError(err, res);
      res.status(200).json({token: data.generateToken()});
    });
  });
});

donorRouter.put('/donors/:id', jsonParser, (req, res) => {
  var donorData = req.body;
  delete donorData._id;
  Donor.update({_id: req.params.id}, donorData, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({msg: 'Successly updated donor'});
  });
});

donorRouter.delete('/donors/:id', (req, res) => {
  Donor.remove({_id: req.params.id}, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({msg: 'Successly deleted donor'});
  });
});

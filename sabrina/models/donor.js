const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var donorSchema = new mongoose.Schema({
  username: String,
  organisation: {type: String, default: 'Amazon'},
  authentication: {
    email: {type: String, required: true},
    password: {type: String, required: true}
  }
});

donorSchema.methods.hashPassword = function(password) {
  var hash = this.authentication.password = bcrypt.hashSync(password, 8);
  return hash;
};

donorSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.authentication.password);
};

donorSchema.methods.generateToken = function() {
  return jwt.sign({id: this._id}, process.env.APP_SECRET || 'changethis');
};

module.exports = exports = mongoose.model('Donor', donorSchema);

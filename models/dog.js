'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var dogSchema = new mongoose.Schema({
  name: String,
  favoriteToy: String,
  fixed: Boolean,
  age: Number,
  kibblePreference: { type: String, default: 'fish' },
  authentication: {
    email: { type: String, required: true },
    password: { type: String, required: true }
  }
});

dogSchema.methods.hashPassword = function(password) {
  var hash = this.authentication.password = bcrypt.hashSync(password, 8);
  return hash;
};

dogSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.authentication.password);
};

dogSchema.methods.generateToken = function() {
  return jwt.sign({id: this._id}, process.env.APP_SECRET || 'changethis');
};

module.exports = exports = mongoose.model('Dog', dogSchema);

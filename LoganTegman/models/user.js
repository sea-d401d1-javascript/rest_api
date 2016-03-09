'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  username: String,
  authentication: {
    email: { type: String, required: true },
    password: { type: String, required: true }
  }
});

userSchema.methods.hashPassword = function(password) {
  this.authentication.password = bcrypt.hashSync(password, 8);
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.authentication.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({ _id: this._id, username: this.username },
    process.env.APP_SECRET || 'changethis');
};

module.exports = exports = mongoose.model('User', userSchema);

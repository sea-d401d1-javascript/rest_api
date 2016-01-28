'use strict';

const mongoose = require('mongoose');

var dogSchema = new mongoose.Schema({
  name: String,
  favoriteToy: String,
  fixed: Boolean,
  age: Number,
  kibblePreference: { type: String, default: 'fish' }
});

module.exports = exports = mongoose.model('Dog', dogSchema);

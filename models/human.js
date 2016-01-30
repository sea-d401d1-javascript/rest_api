'use strict';

const mongoose = require('mongoose');

var humanSchema = new mongoose.Schema({
  name: String,
  fitnessLevel: Number,
  dogPreference: { type: String, default: 'Akita' }
});

var Human = mongoose.model('Human', humanSchema);

Human.schema.path('dogPreference').validate(function(value) {
  return /Akita|Corgi|Terrier|Lab/i.test(value);
}, 'Unavailable dog match');

module.exports = exports = mongoose.model('Human', humanSchema);

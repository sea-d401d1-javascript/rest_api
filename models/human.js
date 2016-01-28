const mongoose = require('mongoose');

var humanSchema = new.mongoose.Schema({
  name: String,
  fitnessLevel: Number,
  dogPreference: {type: String, default: 'Akita'}
});

module.exports = exports = mongoose.model('Human', humanSchema);

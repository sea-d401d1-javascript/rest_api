const mongoose = require('mongoose');

var humanSchema - new.mongoose.Schema({
  name: String,
  flavor: String,
  dogPreference: {type: String, default: 'Akita'}
});

module.exports = exports = mongoose.model('Human', humanSchema);

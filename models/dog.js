const mongoose = require('mongoose');

var dogSchema - new.mongoose.Schema({
  name: String,
  flavor: String,
  kibblePreference: {type: String, default: 'fish'}
});

module.exports = exports = mongoose.model('Dog', dogSchema);

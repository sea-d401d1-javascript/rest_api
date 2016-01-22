const mongoose = require('mongoose');

var DogSchema = new mongoose.Schema({
  name: String,
  color: String,
  lives: {type: Boolean, default: 1}
});

module.exports = exports = mongoose.model('Dog', DogSchema);

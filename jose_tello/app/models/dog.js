const mongoose = require('mongoose');
const random = require('mongoose-random');

var DogSchema = new mongoose.Schema({
  name: String,
  color: String,
  lives: {type: Boolean, default: 1}
});
DogSchema.plugin(random, {path: 'r'});

module.exports = exports = mongoose.model('Dog', DogSchema);

const mongoose = require('mongoose');
const random = require('mongoose-random');

var dogSchema = new mongoose.Schema({
  name: String,
  color: String,
  lives: {type: Boolean, default: 1}
});

dogSchema.plugin(random, { path: 'r' });

module.exports = exports = mongoose.model('Dog', dogSchema);

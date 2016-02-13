const mongoose = require('mongoose');
const random = require('mongoose-random');

var catSchema = new mongoose.Schema({
  name: String,
  color: String,
  lives: {type: Boolean, default: 9}
});

catSchema.plugin(random, { path: 'r' });

module.exports = exports = mongoose.model('Cat', catSchema);

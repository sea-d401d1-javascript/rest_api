const mongoose = require('mongoose');
const random = require('mongoose-random');

var CatSchema = new mongoose.Schema({
  name: String,
  color: String,
  lives: {type: Boolean, default: 9}
});
// CatSchema.plugin(random, {path: 'r'});

module.exports = exports = mongoose.model('Cat', CatSchema);

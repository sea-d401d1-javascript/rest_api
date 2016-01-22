const mongoose = require('mongoose');

var CatSchema = new mongoose.Schema({
  name: String,
  color: String,
  lives: {type: Boolean, default: 9}
});

module.exports = exports = mongoose.model('Cat', CatSchema);

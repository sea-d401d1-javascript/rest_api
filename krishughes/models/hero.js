var mongoose = require('mongoose');

var heroSchema = new mongoose.Schema({
  name: {type: String, required: true},
  power: {type: String, default: 'strength'},
  cape: {type: String, default: 'blue'},
  level: {type: Number, default: 6}
});

module.exports = mongoose.model('Hero', heroSchema);

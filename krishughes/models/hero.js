var mongoose = require('mongoose');

var heroSchema = new mongoose.Schema({
  name: String,
  power: {type: String, default: 'strength'},
  costume: {type: String, default: 'blue'},
  sidekicks: {type: Number, default: 1}
});

module.exports = mongoose.model('Hero', heroSchema);

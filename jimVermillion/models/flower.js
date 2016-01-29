'use strict';

const mongoose = require('mongoose');

var flowerSchema = new mongoose.Schema({
  name: {type: String, required: true},
  color: String,
  difficulty_to_grow: {type: String, default: 'easy'},
  planter: String
});

module.exports = exports = mongoose.model('Flower', flowerSchema);
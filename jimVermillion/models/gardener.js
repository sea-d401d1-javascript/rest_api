'use strict';

const mongoose = require('mongoose');

var gardenerSchema = new mongoose.Schema({
  name: String,
  favFlower: {type: String, default: 'Dandy Lion'},
  experience: {type: String, default: 'beginner'},
  boss: String
});

module.exports = exports = mongoose.model('Gardener', gardenerSchema);

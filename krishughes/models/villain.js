var mongoose = require('mongoose');

var villainSchema = new mongoose.Schema({
  name: {type: String, required: true},
  power: {type: String, default: 'durability'},
  spandex: {type: String, default: 'black'},
  level: {type: Number, default: 5}
});

module.exports = mongoose.model('Villain', villainSchema);

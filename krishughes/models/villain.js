var mongoose = require('mongoose');

var villainSchema = new mongoose.Schema({
  name: String,
  power: {type: String, default: 'strength'},
  costume: {type: String, default: 'black'},
  thugs: {type: Number, default: 5}
});

module.exports = mongoose.model('Villain', villainSchema);

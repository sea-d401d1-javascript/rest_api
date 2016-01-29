var mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
  name: {type: String, required: true},
  level: {type: Number, required: true},
  professor: { type: String, required: true}
});

module.exports = exports = mongoose.model('Class', classSchema);

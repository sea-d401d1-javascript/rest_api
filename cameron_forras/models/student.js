var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: Number,
  major: { type: String, default: 'Undeclared'},
  email: String,
  cell_number: { 
    type: Number,
    validate: {
      validator: function(v) {
        return /d{3}-d{3}-d{4}/.test(v);
      },
      message: '{VALUE} is not a valid phone number!'
    }
  }
});

module.exports = exports = mongoose.model('Student', studentSchema);

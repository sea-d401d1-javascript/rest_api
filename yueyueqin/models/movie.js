const mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
  name: {type:String,default: 'no name'},
  type: {type:String,default:'no type'},
  actors: {type:String,default: 'no actors'},
  publish: Date,
  wranglerId: String
});


var Movie = module.exports = exports = mongoose.model('Movie',movieSchema);

Movie.schema.path('name').validate(function (value) {
  return value.length > 0;
}, 'Have to Input the name for the Movie');

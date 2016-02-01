const mongoose = require('mongoose');

var actorSchema = new mongoose.Schema({
  name:{type:String,default:'no name'},
  country:{type:String,default:'America'},
  age:{type:Number,default:'1'},
  wranglerId:String
});

var Actor = module.exports = exports = mongoose.model('Actor',actorSchema);

Actor.schema.path('age').validate(function(value){
  return value > 0;
},'Age has to be the value larger than 0');

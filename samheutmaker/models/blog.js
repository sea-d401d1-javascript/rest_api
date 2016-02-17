const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = mongoose.Schema({
  name: {
    first: String,
    last: String
  },
  authentication: {
    email: String,
    password: String
  }
});

User.methods.hashPassword = function(password) {
  this.authentication.password = bcrypt.hashSync(password, 8);
}
User.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.authentication.password);
}
User.methods.generateToken = function() {
  return jwt.sign({
    id: this._id,
  }, process.env.TOKEN_SECRET || 'CHANGE_ME');
}


const Post = mongoose.Schema({
  title: String,
  date: Date,
  content: String,
  tags: Array,
  author_id: String
});


const Comment = mongoose.Schema({
  author_id: String,
  post_id: String,
  content: String,
  date: Date
});


module.exports = {
  User: mongoose.model('user', User),
  Post: mongoose.model('post', Post),
  Comment: mongoose.model('comment', Comment)
};

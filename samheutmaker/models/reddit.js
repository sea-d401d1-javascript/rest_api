var mongoose = require('mongoose');


var User = mongoose.Schema({
  name: {
    first: String,
    last: String
  },
  authorization: {
    email: String,
    password: String
  }
});

var Post = mongoose.Schema({
  title: String,
  date: Date,
  content: String,
  tags: Array,
  author_id: String
});


var Vote = mongoose.Schema({
  post_id: String,
  user_id: String,
  vote: Number
});

modules.exports = {
  User: mongoose.model('user', User),
  Post: mongoose.model('post', Post),
  Vote: mongoose.model('vote', Vote);
};

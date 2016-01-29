const mongoose = require('mongoose');


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


var Profile = mongoose.Schema({
  github: String,
  image_url: String,
  hobbies: Array,
  owner_id: String
});

module.exports = {
  User: mongoose.model('user', User),
  Profile: mongoose.model('profile', Profile)
};

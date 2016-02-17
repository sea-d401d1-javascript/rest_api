const express = require('express');
const jsonParser = require('body-parser').json();
const mongoose = require('mongoose');
const blogRoute = require(__dirname + '/routes/blog-routes');
const app = express();

const PORT = process.env.PORT || 8080;

mongoose.connect('localhost:27017');

app.use(express.static(__dirname + '/www/build'));


const User = require(__dirname + '/models/blog').User;
const Post = require(__dirname + '/models/blog').Post;
const Comment = require(__dirname + '/models/blog').Comment;


app.use('/user', blogRoute);


app.listen(PORT, () => {
  console.log('Server live on ' + PORT);
});

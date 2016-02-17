const express = require('express');
const jsonParser = require('body-parser').json();
const mongoose = require('mongoose');
const authRequired = require(__dirname + '/../lib/check-token');
const basicHTTP = require(__dirname + '/../lib/basic-http');

const User = require(__dirname + '/../models/blog').User;
const Post = require(__dirname + '/../models/blog').Post;
const Comment = require(__dirname + '/../models/blog').Comment;

const userRouter = module.exports = exports = express.Router();

// Register User
userRouter.post('/register', jsonParser, (req, res) => {
    var newUser = new User(req.body);
    newUser.authentication.email = req.body.authentication.email;
    newUser.hashPassword(req.body.authentication.password);

    // Check for already existing user
    User.findOne({
      'authentication.email': req.body.authentication.email
    }, (err, user) => {
      if (err || user) {
        return res.status(400).json({
          msg: 'Error. User may already exist'
        })
      } else {
        newUser.save((err, data) => {
          if (err) return console.log(err);

          res.status(200).json({
            msg: 'User Created',
            token: newUser.generateToken(),
            user: data
          });
        });

      }
    });
});

// Log user in
userRouter.get('/login', basicHTTP, (req, res) => {
  User.findOne({
    "authentication.email": req.basicHTTP.email
  }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        msg: 'Invalid username or password1'
      });
    }
    if (!user.comparePassword(req.basicHTTP.password)) {
      return res.status(401).json({
        msg: 'Invalid username or password'
      });
    }
    res.json({
      token: user.generateToken(),
      user: user
    });
  });
});

// Create New Post
userRouter.post('/post', authRequired, jsonParser, (req, res) => {
  if (req.body.content && req.body.title) {
    var newPost = new Post();
    newPost.title = req.body.title;
    newPost.date = new Date();
    newPost.content = req.body.content;
    newPost.tags = req.body.tags;
    newPost.author_id = req.user._id;

    newPost.save((err, data) => {
      if (err) return console.log('Error adding post');

      res.status(200).json({
        msg: 'Post Created',
        data: data
      });
    })
  }
});

// Get all posts 
userRouter.get('/all', authRequired, (req, res) => {
  Post.find({
    author_id: req.user.id
  }, (err, data) => {
    if(err) {
      return res.status(500).json({
        msg: 'There was an error'
      })
    }
    if(!data) {
       return res.status(300).json({
        msg: 'User has no posts'
      })
    }
    res.status(200).json({
      posts: data
    })
  })
})

// Get post by id
userRouter.get('/posts/:id', authRequired, (req, res) => {
  Post.findOne({
    _id: req.params.id
  }, (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Error updating post'
      });
    }

    res.status(200).json({
      msg: 'Post retreived',
      data: data
    });
  })
});

// Edit post by id
userRouter.put('/posts/:id', authRequired, jsonParser, (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  Post.update({
    _id: req.params.id
  }, req.body, (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Error editting post'
      });
    }

    res.status(200).json({
      msg: 'Post Edited',
      data: data
    });
  })
});


// Edit post by id
userRouter.delete('/posts/:id', authRequired, (req, res) => {
  Post.remove({
    _id: req.params.id,
    author_id: req.user._id
  }, (err, data) => {
    if (err) {
      return res.status(500).json({
        msg: 'Error editting post'
      });
    }

    res.status(200).json({
      msg: 'Post Deleted',
      data: data
    });
  })
});


// userRouter.post('/post/:id', authRequired, jsonParser, (req, res) => {
//   if (req.body.content && req.body.author_id) {
//     var newComment = new Comment();

//     newComment.date = new Date();
//     newComment.vote = req.body.vote;
//     newComment.author_id = req.body.author_id;
//     newComment.post_id = req.params.id;

//     newComment.save((err, data) => {
//       if (err) {
//         return res.status(500).json({
//           msg: 'Error creating comment'
//         })
//       }

//       res.status(200).json({
//         msg: 'Comment Created',
//         data: data
//       });
//     });
//   }
// });

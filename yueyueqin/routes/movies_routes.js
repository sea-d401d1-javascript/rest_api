const express = require('express');
const jsonParser = require('body-parser').json();
const Movie = require(__dirname + '/../models/movie');
const handleError = require(__dirname + '/../lib/handle_error');
const jwtAuth =  require(__dirname + '/../lib/jwt_auth');

var movieRouter = module.exports = exports = express.Router();

movieRouter.post('/movies',jwtAuth, jsonParser, (req,res) => {
  //add case sensitive handler
  var newMovie = new Movie(req.body);
  newMovie.wranglerId = req.user._id;
  newMovie.save((err,data) => {
    if(err) handleError(err,res);
    res.status(200).json(data);
  });
});

movieRouter.get('/movies',(req,res) => {
  Movie.find({ }, (err,data) => {
    if(err) return handleError(err,res);

    res.status(200).json(data);
  });
});

movieRouter.get('/mymovies', jwtAuth, (req,res) => {
  Movie.find({wranglerId: req.user._id }, (err,data) => {
    if(err) return handleError(err,res);
    res.status(200).json(data);
  });
});


movieRouter.get('/movies/:type', (req,res) => {
  Movie.find({type:req.params.type}, (err, data) => {
    if (err)  return handleError(err,res);
    res.status(200).json(data);
  });
});

movieRouter.put('/movies/:id', jsonParser, (req,res) => {
  var movieData = req.body;
  delete movieData._id;
  Movie.update({_id:req.params.id}, movieData, {runValidators:true},(err) => {
    if(err)  return handleError(err, res);

    res.status(200).json('success');
  });
});

movieRouter.delete('/movies/:id', (req,res) => {
  Movie.remove({_id:req.params.id},(err) => {
    if(err) return handleError;
    res.status(200).json({msg:'success'});
  });
});

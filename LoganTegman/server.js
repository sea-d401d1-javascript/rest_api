'use strict';

const express = require('express');
const mongoose = require('mongoose');
const app = module.exports = exports = express();

mongoose.connect(process.env.MONGOLAB_URI ||
  'mongodb://localhost/kittens_app_dev');

const kittenRouter = require(__dirname + '/routes/kitten_router');
const internetzRouter = require(__dirname + '/routes/internetz_router');
const kpiRouter = require(__dirname + '/routes/kittens_per_internetz');
const authRouter = require(__dirname + '/routes/auth_router');

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  next();
});

app.use('/api', kittenRouter);
app.use('/api', internetzRouter);
app.use('/api', kpiRouter);
app.use(authRouter);

app.server = app.listen(3000, () => console.log('listening on port: ' + 3000));

// make seperate client-side server so that we have to deal with CORS
express().use(express.static(__dirname + '/build')).listen(3001, () => {
  console.log('client-side server listening on port: ' + 3001);
});

'use strict';

const express = require('express');
const app = module.exports = exports = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/dogs_app_dev');

const dogsRouter = require(__dirname + '/routes/dogs_routes');
const humansRouter = require(__dirname + '/routes/humans_routes');
const authRouter = require(__dirname + '/routes/auth_routes');

app.use('/api', dogsRouter);
app.use('/api', humansRouter);
app.use(authRouter);

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server up on party port: ' + PORT));

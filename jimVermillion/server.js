'use strict';

const express = require('express');
const app = module.exports = exports = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/flower_app');

const flowerRouter = require(__dirname + '/routes/flowerRouter');
const gardenerRouter = require(__dirname + '/routes/gardenerRouter');
const nonCrudRouter = require(__dirname + '/routes/nonCrudRouter');
const userRouter = require(__dirname + '/routes/userRoutes');

app.use('/api', flowerRouter);
app.use('/api', gardenerRouter);
app.use('/api', userRouter);
app.use('/nonCrud', nonCrudRouter);

module.exports.server = app.listen(3000, () => console.log('server up on port: ' + 3000));

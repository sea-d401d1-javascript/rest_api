const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/hogc_dev');

const donorsRouter = require(__dirname + '/routes/donor_routes');
const requestsRouter = require(__dirname + '/routes/request_routes');

app.use('/api', donorsRouter);
app.use('/api', requestsRouter);

var PORT = process.env.PORT || 3000;
var server = module.exports = exports = app.listen(PORT, () => console.log('Server started on port: ' + PORT));

const express = require('express');
const app = module.exports = exports = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/cats_and_dogs');

const catsRouter = require(__dirname + '/routes/cats_routes');
const dogsRouter = require(__dirname + '/routes/dogs_routes');
const authRouter = require(__dirname + '/routes/auth_routes');
const randomizerRouter = require(__dirname + '/routes/randomizer_routes');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use('/app', catsRouter);
app.use('/app', dogsRouter);
app.use('/app', authRouter);
app.use('/app', randomizerRouter);


var PORT = process.env.PORT || 3000;

var server = app.listen(PORT);
console.log('Application started. Listening on port: ' + PORT);

// exports server to allow tests to close down server after testing
module.exports = {
  server: server,
  app: app
};

var mongoose = require('mongoose');
var express = require('express');
var app = express();
var heroesRouter = require(__dirname + '/routes/heroes_routes');
var villainsRouter = require(__dirname + '/routes/villains_routes');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/super_stream_dev');

app.use('/api', heroesRouter);
app.use('/api', villainsRouter);

app.listen(process.env.PORT || 3000, function() {
	console.log('server up');
});

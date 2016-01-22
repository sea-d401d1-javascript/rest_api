const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');

// Schema
const Cat = require(__dirname + '/app/models/cat');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/restful_api');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.listen(PORT, () => console.log('Server listening on port ' + PORT));

var PORT = process.env.PORT || 3000;

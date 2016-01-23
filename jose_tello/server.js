const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const catRouter  = require(__dirname + '/routes/cat_routes');
const dogRouter  = require(__dirname + '/routes/dog_routes');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/restful_api');

app.use('/api', catRouter);

app.listen(PORT, () => console.log('Server listening on port ' + PORT));

var PORT = 3000;

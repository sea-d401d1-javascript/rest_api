const chai       = require('chai');
const chaiHTTP   = require('chai-http');
const fs         = require('fs');
const bodyParser = require('body-parser');
chai.use(chaiHTTP);
const expect     = chai.expect;
const request    = chai.request;

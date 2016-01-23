const chai       = require('chai');
const chaiHTTP   = require('chai-http');
const fs         = require('fs');
const bodyParser = require('body-parser');
chai.use(chaiHTTP);
const expect     = chai.expect;
const request    = chai.request;

describe('INTEGRATION: tests the express app', () => {
  it('should make a successful POST request', (done) => {
    request('localhost:3000')
    .post('/')
    .send({'name':'waffelz', 'color':'brown'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.json).to.eql(bodyParser.json({'name':'waffelz', 'color':'brown'}));
      done();
    });
  });
});

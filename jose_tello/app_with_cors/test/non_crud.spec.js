const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');
const appServer = require(__dirname + '/../server');
const server = require(__dirname + '/../server').server;

describe('NON-CRUD RESOURCE: test the non-crud resource', () => {
  it('should make successful GET requests with a random cat', (done) => {
    chai.request('localhost:3000')
    .get('/app/randomizer/cats')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      done();
    });
  });
  it('should make successful GET requests with a random dog', (done) => {
    chai.request('localhost:3000')
    .get('/app/randomizer/dogs')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      done();
    });
  });
});

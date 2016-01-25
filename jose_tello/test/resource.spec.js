const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');
const appServer = require(__dirname + '/../server');
const server = require(__dirname + '/../server').server;

process.env.MONGOLAB_URI = 'mongodb://localhost/cats_and_dogs_test';

describe('UNIT: test the cats_and_dogs express app', () => {
  after((done) => {
    server.close();
    done();
  });
  it('should be able to retrieve all our cats', (done) => {
    chai.request('localhost:3000')
    .get('/app/cats')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });
  it('should create with a new cat with a POST request', (done) => {
    chai.request('localhost:3000')
    .post('/app/cats')
    .send({name: 'test cat'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.name).to.eql('test cat');
      expect(res.body).to.have.property('_id');
      done();
    });
  });

  it('should be able to retrieve all our dogs', (done) => {
    chai.request('localhost:3000')
    .get('/app/dogs')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });
  it('should create with a new dog with a POST request', (done) => {
    chai.request('localhost:3000')
    .post('/app/dogs')
    .send({name: 'test dog'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.name).to.eql('test dog');
      expect(res.body).to.have.property('_id');
      done();
    });
  });
});

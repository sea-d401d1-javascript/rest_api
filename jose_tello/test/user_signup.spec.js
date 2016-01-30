'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');
const appServer = require(__dirname + '/../server');
const server = require(__dirname + '/../server').server;

const User = require(__dirname + '/../models/user');

process.env.MONGOLAB_URI = 'mongodb://localhost/test_db';

describe('MIDDLEWARE: test the /signup route + middleware', () => {
  before(done => {
    User.create({ username: 'sampleuser', password: 'randompass', email: 'test@example.com' }, (err, data) => {
      if (err) return handleDBError(err, res);
      done();
    });
  });
  it('should query database to check if user already exists', (done) => {
    chai.request('localhost:3000')
    .post('/app/signup')
    .send({ username:'sampleuser', password:'randompass', email: 'test@example.com' })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(400);
      expect(res.body.msg).to.eql('an account with this username already exists');
      done();
    });
  });
  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
});

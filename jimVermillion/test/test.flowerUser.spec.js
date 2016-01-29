'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
const server = require(__dirname + '/../server'); //eslint-disable-line
const request = chai.request;

describe('the user/flower POST to a flower api', () => {
  before( done => {
    // signup user and collect the token
    request('localhost:3000')
      .post('/api/signup')
      .send({ email: 'testUser', password: 'password' })
      .end((err, res) => {
        if (err) return console.log(err);
        expect(err).to.eql(null);
        this.token = (JSON.parse(res.text)).token;
        done();
      });
    });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done(); //eslint-disable-line
    });
  });

  it('should check the data from flower created by user -- POST', done => {
    request('localhost:3000')
      .post('/api/myflowers')
      .set('token', this.token)
      .send({ name: 'testerFlower' })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.eql('testerFlower');
        done();
    });
  });

  it('should check the data from flower created by user -- GET', done => {
    request('localhost:3000')
      .get('/api/myflowers')
      .set('token', this.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        expect(res.body.length).to.eql(1);
        done();
    });
  });

  it('should have a successful login', done => {
    request('localhost:3000')
      .get('/api/signin')
      .auth('testUser', 'password')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        done();
      });
  });
});

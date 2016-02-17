'use strict';

const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/internetz_app_test';
/* eslint-disable no-unused-vars */
const server = require(__dirname + '/../../server');
/* eslint-enable no-unused-vars */
const Internetz = require(__dirname + '/../../models/internetz');
const User = require(__dirname + '/../../models/user');
chai.use(require('chai-http'));

describe('internetz api', () => {

  beforeEach(done => {
    chai.request('localhost:3000')
      .post('/signup')
      .send({
        'email': 'text@example.com',
        'password': 'foobar123'
      })
      .end((err, res) => {
        if (err) return console.log(err);
        this.token = res.body.token;
        done();
      });
  });

  it('should be able to retrieve all the internetz', done => {
    chai.request('localhost:3000')
      .get('/api/internetz')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should create a internetz with a POST', done => {
    chai.request('localhost:3000')
      .post('/api/internetz')
      .set('token', this.token)
      .send({ name: 'test internetz' })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('test internetz');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  describe('requests that require a internetz in db', () => {
    beforeEach(done => {
      Internetz.create({ name: 'test internetz' }, (err, data) => {
        if (err) return console.log(err);
        this.testInternetz = data;
        done();
      });
    });

    it('should be able to update a internetz', done => {
      chai.request('localhost:3000')
        .put('/api/internetz/' + this.testInternetz._id)
        .set('token', this.token)
        .send({ name: 'new internetz name' })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('should be able to delete a internetz', done => {
      chai.request('localhost:3000')
        .delete('/api/internetz/' + this.testInternetz._id)
        .set('token', this.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
  });

  afterEach(done => {
    User.remove({}, () => {
      done();
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
});

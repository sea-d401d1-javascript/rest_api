'use strict';

const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/internetz_app_test';
/* eslint-disable no-unused-vars */
const server = require(__dirname + '/../server');
/* eslint-enable no-unused-vars */
const User = require(__dirname + '/../models/user');
chai.use(require('chai-http'));

describe('auth routes', () => {
  it('should respond to valid signup POST requests', done => {
    chai.request('localhost:3000')
      .post('/signup')
      .send({
        'email': 'text@example.com',
        'password': 'foobar123'
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  describe('tests that require a user in the DB', () => {
    beforeEach(done => {
      const newUser = new User();

      newUser.username = 'test@example.com';
      newUser.authentication.email = 'test@example.com';
      newUser.hashPassword('foobar123');
      newUser.save((err) => {
        if (err) return console.log(err);
        done();
      });
    });

    it('should respond to valid signin GET request', done => {
      chai.request('localhost:3000')
        .get('/signin')
        .set('Authorization', 'Basic ' +
          new Buffer('test@example.com:foobar123').toString('base64'))
        .end((err, res) => {
          console.log(res.body.msg);
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
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

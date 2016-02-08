'use strict';

const chai = require('chai');
const chaihttp = require('chai-http');
chai.use(chaihttp);
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/dogs_app_test';
/* eslint-disable no-unused-vars */
const server = require(__dirname + '/../server');
/* eslint-enable no-unused-vars */
const Dog = require(__dirname + '/../models/dog');

describe('auth routes', () => {
  before((done) => {
    server.listen(3000);
    done();
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

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
      const newDog = new Dog();

      newDog.username = 'test@example.com';
      newDog.authentication.email = 'test@example.com';
      newDog.hashPassword('foobar123');
      newDog.save((err) => {
        if (err) return console.log(err);
        done();
      });
    });

    afterEach((done) => {
      Dog.remove({}, () => {
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
});

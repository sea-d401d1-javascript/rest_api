'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');
const appServer = require(__dirname + '/../server');
const server = require(__dirname + '/../server').server;

const Dog = require(__dirname + '/../models/dog');

process.env.MONGOLAB_URI = 'mongodb://localhost/test_db';

describe('CRUD: tests the GET & POST dog routes', () => {
  let _token = null;
  before(done => {
    chai.request('localhost:3000')
    .post('/app/signup')
    .send({ 'email':'woof@test.com', 'password':'testpass' })
    .end((err, res) => {
      if (err) return console.log(err);
      _token = res.body.token;
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
    .set('token', _token)
    .send({name: 'test dog'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.name).to.eql('test dog');
      expect(res.body).to.have.property('_id');
      done();
    });
  });

  describe('CRUD: tests the PUT & DELETE dog routes', () => {
    beforeEach(done => {
      Dog.create({ name: 'fido'}, (err, data) => {
        if (err) return handleDBError(err, res);
        this.dog = data;
        done();
      });
    });

    it('should update a dog with PUT', (done) => {
      chai.request('localhost:3000')
      .put('/app/dogs/' + this.dog._id)
      .set('token', _token)
      .send({ name: 'renamed dog' })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
    });
    it('should delete a dog with DELETE', (done) => {
      chai.request('localhost:3000')
      .delete('/app/dogs/' + this.dog._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
});

'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const expect = chai.expect;
const mongoose = require('mongoose');
const appServer = require(__dirname + '/../server');
const server = require(__dirname + '/../server').server;

const Cat = require(__dirname + '/../models/cat');

process.env.MONGOLAB_URI = 'mongodb://localhost/test_db';

describe('CRUD: tests the GET & POST cat routes', () => {
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
    .send({ name: 'test cat' })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.name).to.eql('test cat');
      expect(res.body).to.have.property('_id');
      done();
    });
  });

  describe('CRUD: tests the PUT & DELETE cat routes', () => {
    beforeEach(done => {
      Cat.create({ name: 'schrodingers cat'}, (err, data) => {
        if (err) return handleDBError(err, res);
        this.cat = data;
        done();
      });
    });

    it('should update a cat with PUT', (done) => {
      chai.request('localhost:3000')
      .put('/app/cats/' + this.cat._id)
      .send({ name: 'renamed cat' })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
    });
    it('should delete a cat with DELETE', (done) => {
      chai.request('localhost:3000')
      .delete('/app/cats/' + this.cat._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.msg).to.eql('success');
        done();
      });
    });
  });
  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
});

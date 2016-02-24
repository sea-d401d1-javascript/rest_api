'use strict';

const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/kittens_app_test';
/* eslint-disable no-unused-vars */
const server = require(__dirname + '/../../server');
/* eslint-enable no-unused-vars */
const Kitten = require(__dirname + '/../../models/kitten');
chai.use(require('chai-http'));

describe('kittens api', () => {
  it('should be able to retrieve all the kittens', done => {
    chai.request('localhost:3000')
      .get('/api/kittens')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should create a kitten with a POST', done => {
    chai.request('localhost:3000')
      .post('/api/kittens')
      .send({ name: 'test kitten' })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('test kitten');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  describe('requests that require a kitten in db', () => {
    beforeEach(done => {
      Kitten.create({ name: 'test kitten' }, (err, data) => {
        if (err) return console.log(err);
        this.testKitten = data;
        done();
      });
    });

    it('should be able to update a kitten', done => {
      chai.request('localhost:3000')
        .put('/api/kittens/' + this.testKitten._id)
        .send({ name: 'new kitten name' })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('should be able to delete a kitten', done => {
      chai.request('localhost:3000')
        .delete('/api/kittens/' + this.testKitten._id)
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

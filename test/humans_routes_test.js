'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const mongoose = require('mongoose');
process.env.MONGOLABL_URI = 'mongodb://localhost/humans_app_test';

const server = require(__dirname + '/../server');
const Human = require(__dirname + '/../models/human');

describe('human API', () => {
  before((done) => {
    done();
});

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should be able to GET all humans', (done) => {
    request('localhost:3000')
      .get('/api/allhumans/')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should create a human with a POST', (done) => {
      request('localhost:3000')
        .post('/api/human')
        .send({ name: 'test human' })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.name).to.eql('test human');
          expect(res.body).to.have.property('_id');
          done();
        });
    });

    describe('require a human already in db', () => {
      beforeEach((done) => {
        Human.create({ firstName: 'test human' }, (err, data) => {
          if (err) throw err;
          this.testHuman = data;
          done();
        });
      });

      it('should be able to UPDATE a human', (done) => {
        request('localhost:3000')
          .put('/api/human/' + this.testHuman._id)
          .send({ firstName: 'new human name' })
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('Successfully updated human');
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should be able to DELETE a human', (done) => {
        request('localhost:3000')
          .delete('/api/human/' + this.testHuman._id)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('Successfully deleted human');
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });

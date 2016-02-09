'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const mongoose = require('mongoose');
process.env.MONGOLABL_URI = 'mongodb://localhost/humans_app_test';

require(__dirname + '/../server');
const Dog = require(__dirname + '/../models/dog');

describe('dog API', () => {
  before((done) => {
    done();
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should be able to GET all dogs', (done) => {
    request('localhost:3000')
      .get('/api/alldogs/')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  // it('should create a dog with a POST', (done) => {
  //     request('localhost:3000')
  //       .post('localhost:3000')
  //       .send({ dogName: 'test dog' })
  //       .end((err, res) => {
  //         expect(err).to.eql(null);
  //         expect(res).to.have.status(200);
  //         expect(res.body.dogName).to.eql('test dog');
  //         expect(res.body).to.have.property('_id');
  //         done();
  //       });
  //   });

    describe('tests that require a dog in db', () => {
      beforeEach((done) => {
        Dog.create({ authentication: { email: 'test@example.com', password: 'foobar123' } }, (err, data) => {
          if (err) return console.log(err);
          this.testDog = data;
          done();
        });
      });

      it('should be able to UPDATE a dog', (done) => {
        request('localhost:3000')
          .put('/api/dog/' + this.testDog._id)
          .send({ dogName: 'new dog name' })
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('Successfully updated dog');
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should be able to DELETE a dog', (done) => {
        request('localhost:3000')
          .delete('/api/dog/' + this.testDog._id)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('Successfully deleted dog');
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });

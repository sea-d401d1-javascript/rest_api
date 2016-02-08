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

describe('dog API', () => {
  before((done) => {
    server.listen(3000);
    done();
});

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('should be able to GET all dogs', (done) => {
    request('localhost:3000')
      .get('/dog/')
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
        Dog.create({ authentication: {email: 'test@example.com', password: 'foobar123' }}), (err, data) => {
          if (err) return console.log(err);
          this.testDog = data;
          done();
        });
      });

      it('should be able to UPDATE a dog', (done) => {
        request('localhost:3000')
          .put('/dog/' + this.testDog._id)
          .send({ dogName: 'new dog name' })
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('Successly updated dog');
            expect(res).to.have.status(200);
            done();
          });
      });

      it('should be able to DELETE a dog', (done) => {
        request('localhost:3000')
          .delete('/dog/' + this.testDog._id)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(res.body.msg).to.eql('Successly deleted dog');
            expect(res).to.have.status(200);
            done();
          });
      });
    });
  });

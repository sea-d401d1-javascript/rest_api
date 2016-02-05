const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/donors_test';

const server = require(__dirname + '/../server');
const Donor = require(__dirname + '/../models/donor');
var origin = 'localhost:3000/api';

describe('the donors api', () => {
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

  it('should be able to GET all our donors', (done) => {
    request(origin)
    .get('/donors')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  describe('tests that require a donor in database', () => {
    before((done) => {
      Donor.create({authentication: {email: 'donor@test.com', password: 'password'}}, (err, data) => {
        if (err) return console.log(err);
        this.testDonor = data;
        done();
      });
    });

    it('should be able to UPDATE a donor', (done) => {
      request(origin)
        .put('/donors/' + this.testDonor._id)
        .send({username: 'new donor name'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Successly updated donor');
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should be able to DELETE a donor', (done) => {
      request(origin)
        .delete('/donors/' + this.testDonor._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Successly deleted donor');
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

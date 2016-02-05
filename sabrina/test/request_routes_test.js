const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/requests_test';

const server = require(__dirname + '/../server');
const Requests = require(__dirname + '/../models/request');
var origin = 'localhost:3000/api';

describe('the requests api', () => {
  before((done) => {
    server.listen(3000);
    request('localhost:3000')
    .post('/signup')
    .send({'email': 'request@test.com', 'password': 'password'})
    .end((err, res) => {
      if (err) return console.log(err);
      this.token = res.body.token;
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('should be able to GET all our requests', (done) => {
    request(origin)
    .get('/requestsAll')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res).to.have.status(200);
      done();
    });
  });

  it('should be able to GET all our unclaimed requests', (done) => {
    request(origin)
    .get('/requestsUnclaimed')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res).to.have.status(200);
      done();
    });
  });

  it('should be able to GET specific donor claimed requests', (done) => {
    request(origin)
    .get('/myRequests')
    .set('token', this.token)
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  it('should create a request with a POST', (done) => {
    request(origin)
      .post('/requests')
      .send({firstName: 'test request'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.firstName).to.eql('test request');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  describe('tests that require a request in database', () => {
    beforeEach((done) => {
      Requests.create({firstName: 'test request'}, (err, data) => {
        if (err) return console.log(err);
        this.testRequest = data;
        done();
      });
    });

    it('should be able to UPDATE a request', (done) => {
      request(origin)
        .put('/requests/' + this.testRequest._id)
        .send({firstName: 'new request name'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Successfully updated request');
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should be able to claim a request with PUT', (done) => {
      this.testRequest.claimedBy = 'newDonorId';
      request(origin)
        .put('/requests/' + this.testRequest._id + '/' + this.testRequest.claimedBy)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Successfully claimed request');
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should be able to DELETE a request', (done) => {
      request(origin)
        .delete('/requests/' + this.testRequest._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('Successfully deleted request');
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

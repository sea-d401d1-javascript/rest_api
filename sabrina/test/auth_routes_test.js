const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/auth_test';

const server = require(__dirname + '/../server');
const Donor = require(__dirname + '/../models/donor');
var origin = 'localhost:3000';

describe('the auth routes', () => {
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

  it('should be able to signup a donor with a POST request', (done) => {
    request(origin)
    .post('/signup')
    .send({'email': 'test@signup.com', 'password': 'abc123456'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
      done();
    });
  });

  describe('tests that require a user in database', () => {
    beforeEach((done) => {
      var newDonor = new Donor();
      newDonor.username = 'test@signin.com';
      newDonor.authentication.email = 'test@signin.com';
      newDonor.hashPassword('password');
      newDonor.save((err) => {
        if (err) return console.log(err);
        done();
      });
    });

    afterEach((done) => {
      Donor.remove({}, () => {
        done();
      });
    });

    it('should be able to signin a donor with a GET request', (done) => {
      request(origin)
      .get('/signin')
      .set('Authorization', 'Basic ' + new Buffer('test@signin.com:password').toString('base64'))
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
    });
  });
});

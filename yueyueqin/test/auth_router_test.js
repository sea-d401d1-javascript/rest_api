const chai = require ('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/auth_app_test';
const server = require(__dirname + '/../server');
const User = require(__dirname + '/../models/user');
const origin  = 'localhost:3000';

describe('User Authentication: ', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  describe('User signup test: ', () => {
    it('it should be able to create a new user', (done) => {
      var newUser = {email:'newuser@gmail.com',username:'newuser',password:'12345678'};
      chai.request(origin)
        .post('/api/signup')
        .send(newUser)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).have.status(200);
          expect(res.body).to.have.property('token');
          this.token = res.body;
          console.log(this.token);
          done();
        });
    });

    it('should be able to check the user already exists when signup', (done) => {
      var sameUser = {email:'newuser@gmail.com',username:'newuser',password:'12345678'};
      chai.request(origin)
        .post('/api/signup')
        .send(sameUser)
        .end((err, res) => {
          console.log(this.token);
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('user already exist; plese sign in this site');
          done();
        });
    });

    it('should be able to remind user to enter valid username, email and password', (done) => {
      var invalidUser = {email: '', username: '', password: ''};
      chai.request(origin)
        .post('/api/signup')
        .send(invalidUser)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('Please enter a email');
          done();
        });
    });
  });

  describe('User signin test: ', () => {
    var signinuser = {email:'signinuser@gmail.com', username: 'signinuser', password: '12345678'};
    before(function(done) {
      chai.request('localhost:3000')
        .post('/api/signup')
        .send(signinuser)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          this.token = res.body;
          done();
        });
    });
    it('should be able to signin if user valid', (done) => {
      chai.request(origin)
        .get('/api/signin')
        .auth(signinuser.email,signinuser.password)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body).have.property('token');
          done();
        });
    });
  });
});

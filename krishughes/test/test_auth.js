var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URL = 'mongodb://localhost/super_stream_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var User = require(__dirname + '/../models/user');

describe('hero routes', function() {
  //Create dummy user and token
  var token;
  before(function(done) {
    //Sign up
    var user =  new User();
    user.authentication.email = 'test@test.com';
    var hashed = user.hashPassword('foobar123');
    user.authentication.password = hashed;
    user.save(function(err, data) {
      if(err) throw err;
      this.user = data;
      done();
    });
  });
  //Tear down
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  //POST hero
  //Sign in
  it('should be able to signin', function(done) {
    chai.request('localhost:3000')
      .get('/api/signin')
      .auth('test@test.com', 'foobar123')
      .end(function(err, res) {
        expect(err).to.eql(null);
        token = (JSON.parse(res.text)).token;
        done();
      });
  });
  //Make sure sign in worked by creating a hero
  it('should be able to create a hero', function(done) {
    var heroData = {name: 'test hero'};
    chai.request('localhost:3000')
      .post('/api/heroes')
      .set('token', token)
      .send(heroData)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('test hero');
        expect(res.body).to.have.property('_id');
        done();
      });
  });
});



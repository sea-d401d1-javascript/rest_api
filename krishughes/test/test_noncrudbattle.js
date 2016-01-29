var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URL = 'mongodb://localhost/super_stream_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var Hero = require(__dirname + '/../models/hero');
var Villain = require(__dirname + '/../models/villain');

describe('battle route', function() {
  var token;
  //Create dummy hero and villain
  before(function(done) {
    Hero.create({ name: 'test hero' }, function(err, data) {
        this.testHero = data;
    });
    Villain.create({ name: 'test villain' }, function(err, data) {
        this.testVillain = data;
    });
    //Create dummy user and token
    var testUser = {email:'testuser@test.com',password:'foobar123'};
    chai.request('localhost:3000')
      .post('/api/signup')
      .send(testUser)
      .end(function(err, res) {
        expect(err).to.eql(null);
        token = (JSON.parse(res.text)).token;
        done();
      });
  });
  //Tear down
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  //GET TESTS
  //GET without Auth
  it('should deny responding with winner Heroes', function(done) {
    chai.request('localhost:3000')
      .get('/api/battle')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(401);
        expect(res.body.msg).to.eql('authenticat syzz mmmmmeow');
        done();
      });
  });
  //GETs with Auth Heroes win
  it('should be able to respond with winner Heroes', function(done) {
    chai.request('localhost:3000')
      .get('/api/battle')
      .set('token', token)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.text).to.eql('Heroes win the Battle!');
        done();
      });
  });

  //Set up for Villains win test
  describe('battle route Villains win with dummies', function() {
    before(function(done) {
      Villain.create({ name: 'test villain' }, function(err, data) {
        this.testVillain = data;
        done();
      });
    });

    it('should be able to respond with winner Villains', function(done) {
      chai.request('localhost:3000')
        .get('/api/battle')
        .set('token', token)
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.text).to.eql('Villains win the Battle!');
          done();
      });
    });

    //Set up for tie test
    describe('battle route tie with dummies', function() {
      before(function(done) {
        Hero.create({ name: 'test hero', level: 4 }, function(err, data) {
          this.testHero = data;
          done();
        });
      });
      it('should be able to respond with tie', function(done) {
        chai.request('localhost:3000')
          .get('/api/battle')
          .set('token', token)
          .end(function(err, res) {
            expect(err).to.eql(null);
            expect(res.text).to.eql('It was a tie!');
            done();
          });
      });
    });
  });
});


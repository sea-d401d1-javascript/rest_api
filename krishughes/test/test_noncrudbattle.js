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
  before( done => {
    Hero.create({ name: 'test hero' }, function(err, data) {
        this.testHero = data;
    });
    Villain.create({ name: 'test villain' }, function(err, data) {
        this.testVillain = data;
        done();
    });
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should be able to respond with winner Heroes', function(done) {
    chai.request('localhost:3000')
      .get('/api/battle')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.text).to.eql('Heroes win the Battle!');
        done();
      });
  });

  it('should be able to respond with winner Villains', function(done) {
    Villain.create({ name: 'test villain' }, function(err, data) {
      this.testVillain = data;
      chai.request('localhost:3000')
      .get('/api/battle')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.text).to.eql('Villains win the Battle!');
        done();
      });
    });
  });

    it('should be able to respond with tie', function(done) {
    Hero.create({ name: 'test hero', level: 4 }, function(err, data) {
      this.testHero = data;
      chai.request('localhost:3000')
      .get('/api/battle')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.text).to.eql('It was a tie!');
        done();
      });
    });
  });
});


var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URL = 'mongodb://localhost/super_stream_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var Hero = require(__dirname + '/../models/hero');

describe('hero routes', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  //POST hero
  it('should be able to create a hero', function(done) {
    var heroData = {name: 'test hero'};
    chai.request('localhost:3000')
      .post('/api/heroes')
      .send(heroData)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('test hero');
        expect(res.body).to.have.property('_id');
        done();
      });
  });
  //GET hero
  it('should get all of our heroes', function(done) {
    chai.request('localhost:3000')
      .get('/api/heroes')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  describe('needs a hero', () => {
    beforeEach((done) => {
      new Hero({name: 'test hero 2'}).save((err,data) => {
        expect(err).to.eql(null);
        this.hero = data;
        done();
      });
    });

    it('should modify a hero', (done) => {
      chai.request('localhost:3000')
        .put('/api/heroes/' + this.hero._id)
        .send({name: 'changed hero'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('should destroy a hero', (done) => {
      chai.request('localhost:3000')
        .delete('/api/heroes/' + this.hero._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
  });
});


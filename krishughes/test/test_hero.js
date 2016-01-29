var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URL = 'mongodb://localhost/super_stream_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var Hero = require(__dirname + '/../models/hero');

describe('hero routes', function() {
  //Create dummy user and token
  var token;
  before(function(done) {
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
  //POST hero
  //PostWith Auth
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
  //Post Without Auth
  it('should deny creating hero', function(done) {
    var heroData = {name: 'test hero'};
    chai.request('localhost:3000')
      .post('/api/heroes')
      .send(heroData)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(401);
        expect(res.body.msg).to.eql('authenticat syzz mmmmmeow');
        done();
      });
  });
  //GET hero
  //Doesn't need Auth
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

    //PUT
    //Put with Auth
    it('should modify a hero', (done) => {
      chai.request('localhost:3000')
        .put('/api/heroes/' + this.hero._id)
        .set('token', token)
        .send({name: 'changed hero'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
    //Put without Auth
    it('should deny modifing a hero', (done) => {
      chai.request('localhost:3000')
        .put('/api/heroes/' + this.hero._id)
        .send({name: 'changed hero'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.status).to.eql(401);
          expect(res.body.msg).to.eql('authenticat syzz mmmmmeow');
          done();
        });
    });
    //DELETE
    //Delete with Auth
    it('should destroy a hero', (done) => {
      chai.request('localhost:3000')
        .delete('/api/heroes/' + this.hero._id)
        .set('token', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
    //Delete without Auth
    it('should deny destroying a hero', (done) => {
      chai.request('localhost:3000')
        .delete('/api/heroes/' + this.hero._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.status).to.eql(401);
          expect(res.body.msg).to.eql('authenticat syzz mmmmmeow');
          done();
        });
    });
  });
});


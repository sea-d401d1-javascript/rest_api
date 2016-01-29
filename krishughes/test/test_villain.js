var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URL = 'mongodb://localhost/super_stream_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var Villain = require(__dirname + '/../models/villain');

describe('villain routes', function() {
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
  //POST villain
  //Post with Auth
  it('should be able to create a villain', function(done) {
    var villainData = {name: 'test villain'};
      chai.request('localhost:3000')
      .post('/api/villains')
      .set('token', token)
      .send(villainData)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('test villain');
        expect(res.body).to.have.property('_id');
        done();
      });
    });
  //Post without Auth
  it('should deny create a villain', function(done) {
    var villainData = {name: 'test villain'};
      chai.request('localhost:3000')
      .post('/api/villains')
      .send(villainData)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(401);
        expect(res.body.msg).to.eql('authenticat syzz mmmmmeow');
        done();
      });
    });
  //GET villain
  it('should get all of our villains', function(done) {
   chai.request('localhost:3000')
    .get('/api/villains')
    .set('token', token)
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(Array.isArray(res.body)).to.eql(true);
      done();
    });
  });

  describe('needs a villain', () => {
    beforeEach((done) => {
      new Villain({name: 'test villain 2'}).save((err,data) => {
        expect(err).to.eql(null);
        this.villain = data;
        done();
      });
    });
    //PUT villain
    //Put with Auth
    it('should modify a villain', (done) => {
      chai.request('localhost:3000')
        .put('/api/villains/' + this.villain._id)
        .send({name: 'changed villain'})
        .set('token', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
    //Put without Auth
    it('should deny modifing a villain', (done) => {
      chai.request('localhost:3000')
        .put('/api/villains/' + this.villain._id)
        .send({name: 'changed villain'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.status).to.eql(401);
          expect(res.body.msg).to.eql('authenticat syzz mmmmmeow');
          done();
        });
    });
    //DELETE villain
    //Delete with Auth
    it('should destroy a villain', (done) => {
      chai.request('localhost:3000')
        .delete('/api/villains/' + this.villain._id)
        .set('token', token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('should deny destroying a villain', (done) => {
      chai.request('localhost:3000')
        .delete('/api/villains/' + this.villain._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.status).to.eql(401);
          expect(res.body.msg).to.eql('authenticat syzz mmmmmeow');
          done();
        });
    });
  });
});

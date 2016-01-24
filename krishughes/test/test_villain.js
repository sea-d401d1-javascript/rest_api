var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGOLAB_URL = 'mongodb://localhost/super_stream_test';
require(__dirname + '/../server');
var mongoose = require('mongoose');
var Villain = require(__dirname + '/../models/villain');

describe('villain routes', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  //POST villain
  it('should be able to create a villain', function(done) {
    var villainData = {name: 'test villain'};
      chai.request('localhost:3000')
      .post('/api/villains')
      .send(villainData)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('test villain');
        expect(res.body).to.have.property('_id');
        done();
      });
    });
  //GET villain
  it('should get all of our villains', function(done) {
   chai.request('localhost:3000')
    .get('/api/villains')
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

    it('should modify a villain', (done) => {
      chai.request('localhost:3000')
        .put('/api/villains/' + this.villain._id)
        .send({name: 'changed villain'})
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('should destroy a villain', (done) => {
      chai.request('localhost:3000')
        .delete('/api/villains/' + this.villain._id)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
  });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/movies_app_test';//create movies_app_test temporally, will be dropped after test is done
const server = require(__dirname + '/../server');
const Movie = require(__dirname + '/../models/movie');
const jwt = require('jsonwebtoken');
var origin  = 'localhost:3000';
var uri = '/api/movies';


describe('the movie app', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should be able to create a movie with post', (done) => {
    chai.request(origin)
      .post(uri)
      .send({name:'test',type:'type1'})
      .end((err,res) => {
        // expect(err).to.equal(null);
        // expect(res.body.name).to.equal('test');
        // expect(res.body.type).to.equal('type1');
        // expect(res).to.have.status(200);
        // expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should be able to retrieve all our movies', (done) => {
    chai.request(origin)
      .get(uri)
      .end((err,res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should be able to retrieve specific kind type of movies', (done) => {
    chai.request(origin)
      .get(uri + '/Romantic')
      .end((err,res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
        expect(Array.isArray(res.body)).to.equal(true);
        done();
      });
  });

  describe('res requests that require a movie already in db', () => {
    beforeEach((done) => {
      var testMovie = new Movie({name: 'test1', type: 'type1'});
      testMovie.save((err,data) => {
        this.testMovie = data;
        done();
      });
    });

    it('should be able to update a movie', (done) => {
      chai.request('localhost:3000')
        .put('/api/movies/' + this.testMovie._id)
        .send({name: 'test3', type:'type3'})
        .end((err,res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res.body).to.equal('success');
          done();
        });
    });

    it('should be able to delete a movie', (done) => {
      chai.request(origin)
        .del(uri + '/' + this.testMovie._id)
        .end((err,res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.equal('success');
          done();
        });
    });

  });
});

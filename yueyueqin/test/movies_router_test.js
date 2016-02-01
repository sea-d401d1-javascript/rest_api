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
  before((done) => {
    var newUser = {email:'newuser@gmail.com',username:'newuser',password:'12345678'};
    chai.request(origin)
      .post('/api/signup')
      .send(newUser)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).have.status(200);
        expect(res.body).to.have.property('token');
        console.log(res.body.token);
        this.token = res.body.token;
        done();
      });

  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should be able to create a movie with post', (done) => {
    chai.request(origin)
      .post(uri)
      .send({name:'test',type:'type1'})
      .set('token', this.token)
      .end((err,res) => {
        console.log(this.token);
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.equal('test');
        expect(res.body.type).to.equal('type1');
        expect(jwt.verify(this.token,process.env.APP_SECRET || 'changethis').id).to.equal(res.body.wranglerId);
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should be able to retrieve the movies for specific user', (done) => {
    chai.request(origin)
      .get('/api/mymovies')
      .set('token', this.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body[0].name).to.eql('test');
        expect(res.body[0].type).to.eql('type1');
        expect(res.body[0]).to.have.property('_id');
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
      testMovie.wranglerId = jwt.verify(this.token,process.env.APP_SECRET || 'changethis').id;
      testMovie.save((err,data) => {
        this.testMovie = data;
        done();
      });
    });

    it('should be able to update a movie', (done) => {
      chai.request('localhost:3000')
        .put('/api/movies/' + this.testMovie._id)
        .send({name: 'test3', type:'type3'})
        .set('token', this.token)
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
        .set('token',this.token)
        .end((err,res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.equal('success');
          done();
        });
    });

  });
});

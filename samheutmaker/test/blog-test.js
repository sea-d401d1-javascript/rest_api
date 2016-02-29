const chai = require('chai');
chai.use(require('chai-http'));
const expect = chai.expect;

const mongoose = require('mongoose');
const btoa = require('btoa');

process.env.MONGO_URI = 'localhost:27017';

const server = require(__dirname + '/../server');
const Blog = require(__dirname + '/../models/blog');

const baseURI = 'localhost:8080';
var userToken, userId, postId;

// Blog Router
describe('The Blog Router', () => {
  before((done) => {
    chai.request(baseURI)
      .post('/user/register')
      .send({
        "authentication": {
          "email": 'test2@test1.com',
          "password": 'password1'
        }
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        userToken = res.body.token;
        userId = res.body.user._id;
        done();
      });
  });

  it('should create a new post on POST', (done) => {
    chai.request(baseURI)
      .post('/user/post')
      .set('token', userToken)
      .send({
        "title": "title",
        "content": "content",
        "tags": ["some tag"]
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.data.title).to.eql('title');
        expect(res.body.data.content).to.eql('content');
        expect(res.body.data.tags[0]).to.eql('some tag');
        done();
      });
  });

  describe('Routes that require a post in the db', () => {
    before((done) => {
      chai.request(baseURI)
        .post('/user/post')
        .set('token', userToken)
        .send({
          "title": "title",
          "content": "content",
          "tags": ["some tag"]
        })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.data.title).to.eql('title');
          expect(res.body.data.content).to.eql('content');
          expect(res.body.data.tags[0]).to.eql('some tag');
          postId = res.body.data._id;
          done();
        });
    });

    // Get blog post by Id
    it('Should get a blog post by id', (done) => {
      chai.request(baseURI)
        .get('/user/posts/' + postId)
        .set('token', userToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.data.title).to.eql('title');
          expect(res.body.data.content).to.eql('content');
          expect(res.body.data.tags[0]).to.eql('some tag');
          expect(res.body.data._id).to.eql(postId);
          done();
        });
    });

      it('Should get a blog post by id', (done) => {
      chai.request(baseURI)
        .put('/user/posts/' + postId)
        .set('token', userToken)
        .send({
          "title": "title",
          "content": "content",
          "tags": ["some tag"]
        })
        .end((err, res) => {
          expect(err).to.eql(null);
          done();
        });
    });

  });
});

// Auth Router
describe('The auth router', () => {
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
  // Register
  it('Should register a new user on post', (done) => {
    chai.request(baseURI)
      .post('/user/register')
      .send({
        "authentication": {
          "email": 'test@test1.com',
          "password": 'password1'
        }
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        userToken = res.body.token;
        userId = res.body.user._id;
        done();
      });
  });
  // Login
  it('Should respond with token on GET', () => {
    var authString = 'Basic ' + btoa('test2@test1.com:password1');
    chai.request(baseURI)
      .get('/user/login')
      .set('authorization', authString)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        userToken = res.body.token;
        userId = res.body.user._id;
        done();

      });
  });
});
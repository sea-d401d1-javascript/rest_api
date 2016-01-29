const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/actors_app_test';
const server = require(__dirname + '/../server');
const Actor = require(__dirname + '/../models/actor');
const jwt = require('jsonwebtoken');
const origin  = 'localhost:3000';
const uri = '/api/actors';

describe('the actor REST app', () => {
  before((done) => {
    var newUser = {email:'newuser@gmail.com', username:'newuser', password:'12345678'};
    chai.request(origin)
      .post('/api/signup')
      .send(newUser)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res).to.have.status(200);
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

  it('should be able to retrieve all the actors', (done) => {
    chai.request(origin)
      .get(uri)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should be able to retrieve specific actor profile', (done) => {
    chai.request(origin)
      .get(uri + '/' + 'aa')
      .end((err,res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should be able to create a actor profile', (done) => {
    chai.request(origin)
      .post(uri)
      .set('token', this.token)
      .send({'name':'aa'})
      .end((err,res) => {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('aa');
        expect(res).to.have.status(200);
        expect(jwt.verify(this.token,process.env.APP_SECRET || 'changethis').id).to.equal(res.body.wranglerId);
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should be able to retrieve the movies for specific user', (done) => {
    chai.request(origin)
      .get('/api/myactors')
      .set('token', this.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body[0].name).to.eql('aa');
        expect(res.body[0]).to.have.property('_id');
        done();
      });
  });

  describe('res requests that require a actor already in db',() => {
    beforeEach((done) => {
      var testActor = new Actor({name:'test',country:'America',age:22});
      testActor.wranglerId = jwt.verify(this.token,process.env.APP_SECRET || 'changethis').id;
      testActor.save((err,data) => {
        this.testActor = data;
        expect(err).to.eql(null);
        done();
      });
    });

    it('should be able to updata a actor', (done) => {
      chai.request(origin)
        .put(uri + '/' + this.testActor._id)
        .send({name:'test2',country:'America', age:22})
        .set('token', this.token)
        .end((err,res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });

    it('should be able to delete a actor', (done) => {
      chai.request(origin)
        .delete(uri + '/' + this.testActor._id)
        .set('token', this.token)
        .end((err,res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('success');
          done();
        });
    });
  });
});

'use strict';

const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
process.env.MONGOLAB_URI = 'mongodb://localhost/kittens_app_test';
/* eslint-disable no-unused-vars */
const server = require(__dirname + '/../../server');
/* eslint-enable no-unused-vars */
chai.use(require('chai-http'));
const Kitten = require(__dirname + '/../../models/kitten');
const Internetz = require(__dirname + '/../../models/internetz');

describe('kittens per internetz', () => {
  before(done => {
    const kittenProm = Kitten.create({ 'name': 'test kitten' });
    const internetzProm = Internetz.create({ 'name': 'test internetz' });
    Promise.all([kittenProm, internetzProm])
      .then(() => done())
      .catch(err => console.log(err));
  });

  it('should give us a ratio', done => {
    chai.request('localhost:3000')
      .get('/api/ratio')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.KPIratio).to.eql(1);
        done();
      });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });
});

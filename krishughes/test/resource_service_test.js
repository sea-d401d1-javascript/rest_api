var angular = require('angular');

describe('resource service', () => {
  beforeEach(angular.mock.module('supersApp'));

  var $httpBackend;
  var Resource;
  var testResource;

  beforeEach(angular.mock.inject(function(_$httpBackend_, cfResource) {
    $httpBackend = _$httpBackend_;
    Resource = cfResource;
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be a service', () => {
    expect(typeof Resource).toBe('function');
  });

  it('should assign something to the resource', () => {
    expect(Resource('/test').resourceName).toBe('/test');
  });

  it('should make a GET request', () => {
    $httpBackend.expectGET('http://localhost:3000/api/heroes')
      .respond(200, {name: 'test hero'});
    var resource = Resource('/heroes');
    resource.getAll(function(err, res){
      expect(res.name).toBe('test hero');
    });
    $httpBackend.flush();
  });

  it('should make a POST request', () => {
    var sentHero = {name: 'the sent hero'};
    $httpBackend.expectPOST('http://localhost:3000/api/heroes', sentHero)
      .respond(200, {name: 'the response hero'});
    var resource = Resource('/heroes');
    resource.create(sentHero, function(err, res) {
      expect(res.name).toBe('the response hero');
    });
    $httpBackend.flush();
  });

  it('should make a PUT request', () => {
    var hero = {_id: 1, name: 'update hero', editing: true};
    $httpBackend.expectPUT('http://localhost:3000/api/heroes/1', hero)
      .respond(200);
    var resource = Resource('/heroes');
    resource.update(hero, function(err, res) {
      expect(err).toBe(null);
    });
    $httpBackend.flush();
  });

  it('should make a DELETE request', () => {
    var hero = {_id: 1, name: 'delete hero'};
    $httpBackend.expectDELETE('http://localhost:3000/api/heroes/1').respond(200);
    var resource = Resource('/heroes');
    resource.delete(hero, function(err, res) {
      expect(err).toBe(null);
    });
    $httpBackend.flush();
  });

  it('should error', () => {
    $httpBackend.expectGET('http://localhost:3000/api/heroes')
      .respond(404);
    var resource = Resource('/heroes');
    resource.getAll(function(err, res){
      expect(typeof(err)).toBe('object');
      expect(typeof(res)).toBe('undefined');
    });
    $httpBackend.flush();
  });
});

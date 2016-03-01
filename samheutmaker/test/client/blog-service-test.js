var angular = require('angular');

describe('Blog Service', () => {
  beforeEach(angular.mock.module('blogApp'));
  // Vars
  var $httpBackend, Resource;
  // Mock
  beforeEach(angular.mock.inject(function(_$httpBackend_, Blog) {
    $httpBackend = _$httpBackend_;
  }));

  // Check for unfullfiled requests
  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Should be a service', () => {
    expect(typeof Blog).toBe('object');
  });

});
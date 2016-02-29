require('../app/js/controller');
var angular = require('angular');
require('angular-mocks');

describe('cats controller', () => {
  var $httpBackend;
  var $scope;
  var $ControllerConstructor;

  beforeEach(angular.mock.module('catsApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $ControllerConstructor = $controller;
    $scope = $rootScope.$new();
  }));

  it('should be able to construct a controller', () => {
    var catsController = $ControllerConstructor('CatsController', { $scope });
    expect(typeof catsController).toBe('object');
    expect(Array.isArray($scope.cats)).toBe(true);
    expect(typeof $scope.getAll).toBe('function');
  });

  describe('REST requests', () => {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $ControllerConstructor('CatsController', { $scope });
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a GET request to /app/cats', () => {
      $httpBackend.expectGET('http://localhost:3000/app/cats').respond(200, [{ name: 'test cat' }]);
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.cats.length).toBe(1);
      expect($scope.cats[0].name).toBe('test cat');
    });

    it('should make a POST request to /app/cats', () => {
      $httpBackend.expectPOST('http://localhost:3000/app/cats', { name: 'post cat' }).respond(200, { name: 'response cat' });
      $scope.newCat = { name: 'new cat' };
      $scope.createCat({ name: 'post cat' });
      $httpBackend.flush();
      expect($scope.cats.length).toBe(1);
      expect($scope.newCat).toBe(null);
      expect($scope.cats[0].name).toBe('response cat');
    });

    it('should update an existing cat', () => {
      var testCat = { name: 'schrodingers cat', editing: true, _id: 1 };
      $scope.cats.push(testCat);
      $httpBackend.expectPUT('http://localhost:3000/app/cats/1', testCat).respond(200);
      $scope.updateCat(testCat);
      $httpBackend.flush();
      expect(testCat.editing).toBe(false);
      expect($scope.cats[0].editing).toBe(false);
    });

    it('should delete an existing cat', () => {
      var deleteCat = { name: 'deleted cat', color: 'blue', _id: 1 };
      $scope.cats.push(deleteCat);
      expect($scope.cats.indexOf(deleteCat)).not.toBe(-1);
      $httpBackend.expectDELETE('http://localhost:3000/app/cats/1').respond(200);
      $scope.deleteCat(deleteCat);
      $httpBackend.flush();
      expect($scope.cats.indexOf(deleteCat)).toBe(-1);
    });

  });

});

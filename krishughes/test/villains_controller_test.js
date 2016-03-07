var angular = require('angular');

describe('VillainsController', () => {
  var $httpBackend;
  var $scope;
  var $ControllerConstructor;

  beforeEach(angular.mock.module('supersApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $ControllerConstructor = $controller;
    $scope = $rootScope.$new();
  }));

  it('should be able to make a controller', () => {
    var villainsController = $ControllerConstructor('VillainsController', {$scope});
    expect(typeof villainsController).toBe('object');
    expect(Array.isArray($scope.villains)).toBe(true);
    expect(typeof $scope.getAllVillains).toBe('function');
  });

  describe('REST requests', () => {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $ControllerConstructor('VillainsController', {$scope});
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    //Villain Get
    it('should make a get request to /api/villains', () => {
      $httpBackend.expectGET('http://localhost:3000/api/villains').respond(200, [{name: 'test villain'}]);
      $scope.getAllVillains();
      $httpBackend.flush();
      expect($scope.villains.length).toBe(1);
      expect($scope.villains[0].name).toBe('test villain');
    });

    //Villain Post
    it('should create a new villain', () => {
      $httpBackend.expectPOST('http://localhost:3000/api/villains', {name: 'the sent villain'})
        .respond(200, {name: 'the response villain'});
      $scope.super = {name: 'the new villain'};
      $scope.createVillain({name: 'the sent villain'});
      $httpBackend.flush();
      expect($scope.villains.length).toBe(1);
      expect($scope.super).toBe(null);
      expect($scope.villains[0].name).toBe('the response villain');
    });

    //Villain Put
    it('should make an update put request to /api/villains', () => {
      var villain = {_id: 1, name: 'update villain', editing: true};
      $scope.villains.push(villain);
      expect($scope.villains.indexOf(villain)).not.toBe(-1);
      $httpBackend.expectPUT('http://localhost:3000/api/villains/1', villain).respond(200);
      $scope.updateVillain(villain);
      $httpBackend.flush();
      expect($scope.villains.length).toBe(1);
      expect($scope.villains[0].editing).toBe(false);
      expect(villain.editing).toBe(false);
    });

    //Villain Delete
    it('should make a delete to /api/villains', () => {
      var villain = {_id: 1, name: 'delete villain'};
      $scope.villains.push(villain);
      expect($scope.villains.length).toBe(1);
      expect($scope.villains.indexOf(villain)).not.toBe(-1);
      $httpBackend.expectDELETE('http://localhost:3000/api/villains/1').respond(200);
      $scope.deleteVillain(villain);
      $httpBackend.flush();
      expect($scope.villains.length).toBe(0);
      expect($scope.villains.indexOf(villain)).toBe(-1);
    });
  });
});

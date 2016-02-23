require(__dirname + '/../app/js/client');
var angular = require('angular');
require('angular-mocks');

describe('SupersController', () => {
  var $httpBackend;
  var $scope;
  var $ControllerConstructor;

  beforeEach(angular.mock.module('supersApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $ControllerConstructor = $controller;
    $scope = $rootScope.$new();
  }));

  it('should be able to make a controller', () => {
    var supersController = $ControllerConstructor('SupersController', {$scope});
    expect(typeof supersController).toBe('object');
    expect(Array.isArray($scope.heroes)).toBe(true);
    expect(Array.isArray($scope.villains)).toBe(true);
    expect(typeof $scope.getAllHeroes).toBe('function');
    expect(typeof $scope.getAllVillains).toBe('function');
  });
  describe('REST requests', () => {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $ControllerConstructor('SupersController', {$scope});
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a get request to /api/heroes', () => {
      $httpBackend.expectGET('http://localhost:3000/api/heroes').respond(200, [{name: 'test hero'}]);
      $scope.getAllHeroes();
      $httpBackend.flush();
      expect($scope.heroes.length).toBe(1);
      expect($scope.heroes[0].name).toBe('test hero');
    });

    it('should create a new hero', () => {
      $httpBackend.expectPOST('http://localhost:3000/api/heroes', {name: 'the sent hero'}).respond(200,
      	{name: 'the response hero'});
      $scope.newHero = {name: 'the new hero'};
      $scope.createHero({name: 'the sent hero'});
      $httpBackend.flush();
      expect($scope.heroes.length).toBe(1);
      expect($scope.newHero).toBe(null);
      expect($scope.heroes[0].name).toBe('the response hero');
    });

    it('should make an update put request to /api/heroes', () => {
      var hero = {_id: 1, name: 'update hero', editting: true};
      $scope.heroes = [hero];
      $httpBackend.expectPUT('http://localhost:3000/api/heroes/' + hero._id).respond(200);
      $scope.updateHero(hero);
      $httpBackend.flush();
      expect($scope.heroes.length).toBe(1);
      expect($scope.heroes[0].name).toBe('update hero');
      expect(hero.editting).toBe(false);
    });

    it('should make a delete to /api/heroes', () => {
      var hero = {_id: 1, name: 'delete hero'};
      $scope.heroes = [hero];
      expect($scope.heroes.length).toBe(1);
      $httpBackend.expectDELETE('http://localhost:3000/api/heroes/' + hero._id).respond(200);
      $scope.deleteHero(hero);
      $httpBackend.flush();
      expect($scope.heroes.length).toBe(0);
    });
  });
});

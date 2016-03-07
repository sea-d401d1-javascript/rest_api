var angular = require('angular');

describe('HeroesController', () => {
  var $httpBackend;
  var $scope;
  var $ControllerConstructor;

  beforeEach(angular.mock.module('supersApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $ControllerConstructor = $controller;
    $scope = $rootScope.$new();
  }));

  it('should be able to make a controller', () => {
    var heroesController = $ControllerConstructor('HeroesController', {$scope});
    expect(typeof heroesController).toBe('object');
    expect(Array.isArray($scope.heroes)).toBe(true);
    expect(typeof $scope.getAllHeroes).toBe('function');
  });

  describe('REST requests', () => {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $ControllerConstructor('HeroesController', {$scope});
    }));

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    //Hero Get
    it('should make a get request to /api/heroes', () => {
      $httpBackend.expectGET('http://localhost:3000/api/heroes').respond(200, [{name: 'test hero'}]);
      $scope.getAllHeroes();
      $httpBackend.flush();
      expect($scope.heroes.length).toBe(1);
      expect($scope.heroes[0].name).toBe('test hero');
    });

    //Hero Post
    it('should create a new hero', () => {
      $httpBackend.expectPOST('http://localhost:3000/api/heroes', {name: 'the sent hero'}).respond(200,
      	{name: 'the response hero'});
      $scope.super = {name: 'the new hero'};
      $scope.createHero({name: 'the sent hero'});
      $httpBackend.flush();
      expect($scope.heroes.length).toBe(1);
      expect($scope.super).toBe(null);
      expect($scope.heroes[0].name).toBe('the response hero');
    });

    //Hero Put
    it('should make an update put request to /api/heroes', () => {
      var hero = {_id: 1, name: 'update hero', editing: true};
      $scope.heroes.push(hero);
      expect($scope.heroes.indexOf(hero)).not.toBe(-1);
      $httpBackend.expectPUT('http://localhost:3000/api/heroes/1', hero).respond(200);
      $scope.updateHero(hero);
      $httpBackend.flush();
      expect($scope.heroes.length).toBe(1);
      expect($scope.heroes[0].editing).toBe(false);
      expect(hero.editing).toBe(false);
    });

    //Hero Delete
    it('should make a delete to /api/heroes', () => {
      var hero = {_id: 1, name: 'delete hero'};
      $scope.heroes.push(hero);
      expect($scope.heroes.length).toBe(1);
      expect($scope.heroes.indexOf(hero)).not.toBe(-1);
      $httpBackend.expectDELETE('http://localhost:3000/api/heroes/1').respond(200);
      $scope.deleteHero(hero);
      $httpBackend.flush();
      expect($scope.heroes.length).toBe(0);
      expect($scope.heroes.indexOf(hero)).toBe(-1);
    });
  });
});

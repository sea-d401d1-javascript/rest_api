var angular = require('angular');

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

    //Hero Get
    it('should make a get request to /api/heroes', () => {
      $httpBackend.expectGET('http://localhost:3000/api/heroes').respond(200, [{name: 'test hero'}]);
      $scope.getAllHeroes();
      $httpBackend.flush();
      expect($scope.heroes.length).toBe(1);
      expect($scope.heroes[0].name).toBe('test hero');
    });

    //Villain Get
    it('should make a get request to /api/villains', () => {
      $httpBackend.expectGET('http://localhost:3000/api/villains').respond(200, [{name: 'test villain'}]);
      $scope.getAllVillains();
      $httpBackend.flush();
      expect($scope.villains.length).toBe(1);
      expect($scope.villains[0].name).toBe('test villain');
    });

    //Hero Post
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

    //Villain Post
    it('should create a new villain', () => {
      $httpBackend.expectPOST('http://localhost:3000/api/villains', {name: 'the sent villain'})
        .respond(200, {name: 'the response villain'});
      $scope.newVillain = {name: 'the new villain'};
      $scope.createVillain({name: 'the sent villain'});
      $httpBackend.flush();
      expect($scope.villains.length).toBe(1);
      expect($scope.newVillain).toBe(null);
      expect($scope.villains[0].name).toBe('the response villain');
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

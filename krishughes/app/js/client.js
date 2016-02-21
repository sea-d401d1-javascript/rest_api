const angular = require('angular');
const supersApp = angular.module('supersApp', []);
require(__dirname + '/services/resource_service')(supersApp);
require(__dirname + '/services/cf_store')(supersApp);

supersApp.controller('SupersController', ['$scope', '$http', 'cfResource', 'cfStore',
  function($scope, $http, Resource, cfStore) {

  cfStore.set('greeting', 'hello world');
  $scope.heroes = [];
  $scope.villains = [];
  var heroService = Resource('/heroes');
  var villainService = Resource('/villains');

  $scope.getAllHeroes = function() {
    heroService.getAll(function(err, res) {
      if (err) return console.log(err);
      $scope.heroes = res;
    });
  };

  $scope.createHero = function(hero) {
    heroService.create(hero, function(err, res) {
      if (err) return console.log(err);
      $scope.heroes.push(res);
      $scope.newHero = null;
    });
  };

  $scope.deleteHero = function(hero) {
    heroService.delete(hero, function(err, res) {
      if (err) return console.log(err);
      $scope.heroes.splice($scope.heroes.indexOf(hero), 1);
    });
  };

  $scope.updateHero = function(hero) {
    heroService.update(hero, function(err, res) {
      hero.editing = false;
      if (err) return console.log(err);
    });
  };

  $scope.getAllVillains = function() {
    villainService.getAll(function(err, res) {
      if (err) return console.log(err);
      $scope.villains = res;
    });
  };

  $scope.createVillain = function(villain) {
    villainService.create(villain, function(err, res) {
      if (err) return console.log(err);
      $scope.villains.push(res);
      $scope.newVillain = null;
    });
  };

  $scope.deleteVillain = function(villain) {
    villainService.delete(villain, function(err, res) {
      if (err) return console.log(err);
      $scope.villains.splice($scope.villains.indexOf(villain), 1);
    });
  };

  $scope.updateVillain = function(villain) {
    villainService.update(villain, function(err, res) {
      villain.editing = false;
      if (err) return console.log(err);
    });
  };
}]);

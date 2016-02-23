const angular = require('angular');

const supersApp = angular.module('supersApp', []);

supersApp.controller('SupersController', ['$scope', '$http', function($scope, $http) {
  $scope.heroes = [];
  $scope.villains = [];

  $scope.getAllHeroes = function() {
    $http.get('http://localhost:3000/api/heroes')
      .then(function(res) {
        console.log('success!');
        $scope.heroes = res.data;
      }, function(err) {
        console.log(err);
      });
  };

  $scope.createHero = function(hero) {
    $http.post('http://localhost:3000/api/heroes', hero)
      .then(function(res) {
        $scope.heroes.push(res.data);
        $scope.newHero = null;
      }, function(err) {
        console.log(err);
      });
  };

  $scope.deleteHero = function(hero) {
    $http.delete('http://localhost:3000/api/heroes/' + hero._id)
      .then(function(res) {
        $scope.heroes = $scope.heroes.filter(function(i) { i !== hero });
      }, function(err) {
        console.log(err);
      });
  };

  $scope.updateHero = function(hero) {
    $http.put('http://localhost:3000/api/heroes/' + hero._id)
      .then(function(res) {
        hero.editting = false;
      }, function(err) {
        console.log(err);
        hero.editting = false;
      });
  };
  $scope.getAllVillains = function() {
    $http.get('http://localhost:3000/api/villains')
      .then(function(res) {
        console.log('success!');
        $scope.villains = res.data;
      }, function(err) {
        console.log(err);
      });
  };

  $scope.createVillain = function(villain) {
    $http.post('http://localhost:3000/api/villains', villain)
      .then(function(res) {
        $scope.villains.push(res.data);
        $scope.newVillain = null;
      }, function(err) {
        console.log(err);
      });
  };

  $scope.deleteVillain = function(villain) {
    $http.delete('http://localhost:3000/api/villains/' + villain._id)
      .then(function(res) {
        $scope.villains = $scope.villains.filter(function(i) { i !== villain });
      }, function(err) {
        console.log(err);
      });
  };

  $scope.updateVillain = function(villain) {
    $http.put('http://localhost:3000/api/villains/' + villain._id)
      .then(function(res) {
        villain.editting = false;
      }, function(err) {
        console.log(err);
        villain.editting = false;
      });
  };
}]);

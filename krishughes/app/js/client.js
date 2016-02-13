const angular = require('angular');

const supersApp = angular.module('supersApp', []);

supersApp.controller('supersController', ['$scope', '$http', ($scope, $http) => {
  $scope.heroes = [];

  $http.get('http://localhost:3000/api/heroes')
    .then((res) => {
      console.log('success!');
      $scope.heroes = res.data;
    }, (err) => {
      console.log(err);
    });

  $scope.createHero = function(hero) {
    $http.post('http://localhost:3000/api/heroes', hero)
      .then((res) => {
        $scope.heroes.push(res.data);
        $scope.newHero = null;
      }, (err) => {
        console.log(err);
      });
  }

  $scope.deleteHero = function(hero) {
    $http.delete('http://localhost:3000/api/heroes/' + hero._id)
      .then((res) => {
        $scope.heroes = $scope.heroes.filter((i) => i !== hero);
      }, (err) => {
        console.log(err)
      })
  }

  $scope.updateHero = function(hero) {
    $http.put('http://localhost:3000/api/heroes/' + hero._id)
      .then((res) => {
        hero.editting = false;
      }, (err) => {
        console.log(err);
        hero.editting = false;
      });
  }

    $http.get('http://localhost:3000/api/villains')
    .then((res) => {
      console.log('success!');
      $scope.villains = res.data;
    }, (err) => {
      console.log(err);
    });

  $scope.createVillain = function(villain) {
    $http.post('http://localhost:3000/api/villains', villain)
      .then((res) => {
        $scope.villains.push(res.data);
        $scope.newVillain = null;
      }, (err) => {
        console.log(err);
      })
  }

  $scope.deleteVillain = function(villain) {
    $http.delete('http://localhost:3000/api/villains/' + villain._id)
      .then((res) => {
        $scope.villains = $scope.villains.filter((i) => i !== villain);
      }, (err) => {
        console.log(err)
      })
  }

  $scope.updateVillain = function(villain) {
    $http.put('http://localhost:3000/api/villains/' + villain._id)
      .then((res) => {
        villain.editting = false;
      }, (err) => {
        console.log(err);
        villain.editting = false;
      });
  }

}]);

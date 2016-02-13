const angular = require('angular');

const villainsApp = angular.module('villainsApp', []);

villainsApp.controller('villainsController', ['$scope', '$http', ($scope, $http) => {
  $scope.villains = [];

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



}]);

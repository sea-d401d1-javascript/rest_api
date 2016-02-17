'use strict';

const angular = require('angular');

const catsApp = angular.module('catsApp', []);

catsApp.controller('CatsController', ['$scope', '$http', function($scope, $http) {
  $scope.cats = [];

  $scope.getAll = function() {
    $http.get('http://localhost:3000/app/cats')
    .then((res) => {
      console.log('GET request success!');
      $scope.cats = res.data;
    }, (err) => {
      console.log(err);
    });
  };

  $scope.createCat = function(cat) {
    // $http.defaults.headers.post.token = token;
    $http.post('http://localhost:3000/app/cats', cat)
      .then((res) => {
        $scope.cats.push(res.data);
        $scope.newCat = null;
      }, (err) => {
        console.log(err);
      });
  };

  $scope.deleteCat = function(cat) {
    $http.delete('http://localhost:3000/app/cats/' + cat._id)
      .then((res) => {
        $scope.cats = $scope.cats.filter((i) => i !== cat);
      }, (err) => {
        console.log(err);
      });
  };

  $scope.updateCat = function(cat) {
    $http.put('http://localhost:3000/app/cats/' + cat._id)
      .then((res) => {
        $scope.cats[$scope.cats.indexOf(cat)] = cat;
      }, (err) => {
        console.log(err);
      });
  };
}]);

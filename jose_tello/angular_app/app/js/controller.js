'use strict';

const angular = require('angular');
const catsApp = angular.module('catsApp', []);
require('./services/resource_service')(catsApp);

catsApp.controller('CatsController', ['$scope', '$http', 'catResource', function($scope, $http, Resource) {
  $scope.cats = [];
  var catsService = Resource('/cats');

  $scope.getAll = function() {
    catsService.getAll(function(err, res) {
      if (err) return console.log(err);
      $scope.cats = res;
    });
  };

  $scope.createCat = function(cat) {
    catsService.create(cat, function(err, res) {
      if (err) return console.log(err);
      $scope.cats.push(res);
      $scope.newCat = null;
    });
  };

  $scope.deleteCat = function(cat) {
    catsService.delete(cat, function(err, res) {
      if (err) return console.log(err);
      $scope.cats.splice($scope.cats.indexOf(cat), 1);
    });
  };

  $scope.updateCat = function(cat) {
    catsService.update(cat, function(err, res) {
      cat.editing = false;
      if (err) return console.log(err);
    });
  };
}]);

var angular = require('angular');

module.exports = function(app) {
  app.controller('VillainsController', ['$scope', '$http', 'cfResource',
    function($scope, $http, Resource) {

      $scope.villains = [];
      var villainService = Resource('/villains');

      $scope.toggleEdit = function(villain) {
        if (villain.backup) {
          var temp = villain.backup;
          $scope.villains.splice($scope.villains.indexOf(villain), 1, temp);
        } else {
          villain.backup = angular.copy(villain);
          villain.editing = true;
        }
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
          $scope.super = null;
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
          villain.backup = null;
          if (err) return console.log(err);
        });
      };
  }]);
}

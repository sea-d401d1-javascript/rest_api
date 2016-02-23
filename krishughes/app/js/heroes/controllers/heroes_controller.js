module.exports = function(app) {
  app.controller('HeroesController', ['$scope', '$http', 'cfResource',
    function($scope, $http, Resource) {

      $scope.heroes = [];
      var heroService = Resource('/heroes');

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
  }]);
}

'use strict';

export default ($scope, $http, Resource) => {
  $scope.kittens = [];
  $scope.loaded = false;
  $scope.newKitten = {};

  const kittenService = new Resource('/kittens');

  $scope.getKittens = () => {
    kittenService.getAll((err, data) => {
      if (err) return console.log(err);
      $scope.kittens = data;
      $scope.loaded = true;
    });
  };
  $scope.addKitten = (kitten) => {
    kittenService.create(kitten, (err, data) => {
      if (err) return console.log(err);
      $scope.kittens.push(data);
      $scope.newKitten = null;
    });
  };
  $scope.deleteKitten = (kitten) => {
    kittenService.delete(kitten, (err) => {
      if (err) return console.log(err);
      $scope.kittens = $scope.kittens.filter((curr) => curr._id !== kitten._id);
    });
  };
  $scope.editKitten = (kitten) => {
    kittenService.update(kitten, (err) => {
      if (err) return console.log(err);
      kitten.editing = false;
    });
  };
};

'use strict';

export default function($scope, $http) {
  $scope.kittens = [];
  $scope.loaded = false;
  $scope.newKitten = {};

  $scope.getKittens = () => {
    $http.get('http://localhost:3000/api/kittens')
      .then((res) => {
        $scope.kittens = res.data;
        $scope.loaded = true;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  $scope.addKitten = () => {
    $http.post('http://localhost:3000/api/kittens', $scope.newKitten)
      .then((res) => {
        $scope.kittens.push(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  $scope.deleteKitten = (_id) => {
    $http.delete('http://localhost:3000/api/kittens/' + _id)
      .then(() => {
        $scope.kittens = $scope.kittens.filter((kitten) => kitten._id !== _id);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  $scope.editKitten = (kitten) => {
    $http.put('http://localhost:3000/api/kittens/' + kitten._id, kitten)
      .then(() => {
        kitten.editing = false;
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

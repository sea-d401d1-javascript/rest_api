'use strict';

export default ($scope, $http) => {
  $scope.internetz = [];
  $scope.loaded = false;
  $scope.newInternet = {};

  $scope.getInternetz = () => {
    $http.get('http://localhost:3000/api/internetz')
      .then((res) => {
        $scope.internetz = res.data;
        $scope.loaded = true;
      })
      .catch((err) => console.log(err));
  };
  $scope.addInternet = (newInternet) => {
    $http.post('http://localhost:3000/api/internetz', newInternet)
      .then((res) => {
        $scope.internetz.push(res.data);
        $scope.newInternet = null;
      })
      .catch((err) => console.log(err));
  };
  $scope.deleteInternet = (_id) => {
    $http.delete('http://localhost:3000/api/internetz/' + _id)
      .then(() => {
        $scope.internetz = $scope.internetz
          .filter((internet) => internet._id !== _id);
      })
      .catch((err) => console.log(err));
  };
  $scope.editInternet = (internet) => {
    $http.put('http://localhost:3000/api/internetz/' + internet._id, internet)
      .then(() => {
        internet.editing = false;
      })
      .catch((err) => console.log(err));
  };
};

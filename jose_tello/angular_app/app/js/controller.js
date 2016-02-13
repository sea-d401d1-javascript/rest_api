'use strict';

const angular = require('angular');

const catsApp = angular.module('catsApp', []);

catsApp.controller('catsController', ['$scope', '$http', ($scope, $http) => {
  $scope.cats = [];

  $http.get('http://localhost:3000/app/cats')
    .then((res) => {
      console.log('GET request success!');
      $scope.cats = res.data;
    }, (err) => {
      console.log(err);
    });

  // Create a new user object, /signup with user, then /signin
  // var user = {
  //   username: 'test_user',
  //   authentication: {
  //     email: 'test@user.com',
  //     password: 'samplepass'
  //   }
  // };
  //
  // let token; // Instantiate a token variable to set for later
  //
  // $http.post('http://localhost:3000/app/signup', user)
  //   .then((res) => {
  //     token = res.body.token;
  //     console.log(token);
  //     console.log('Sign Up route accessed.');
  //   }, (err) => {
  //     console.log(err);
  //   });
  // $http.get('http://localhost:3000/app/signin')
  //   .then((res) => {
  //     console.log('Test user signed in successfully.');
  //   }, (err) => {
  //     console.log(err);
  //   });
  // End /signup & /signin (for authentication)

  $scope.createCat = (cat) => {
    // $http.defaults.headers.post.token = token;
    $http.post('http://localhost:3000/app/cats', cat)
      .then((res) => {
        $scope.cats.push(res.data);
        $scope.newCat = null;
      }, (err) => {
        console.log(err);
      });
  };

  $scope.deleteCat = (cat) => {
    $http.delete('http://localhost:3000/app/cats/' + cat._id)
      .then((res) => {
        $scope.cats = $scope.cats.filter((i) => i !== cat);
      }, (err) => {
        console.log(err);
      });
  };

  $scope.updateCat = (cat) => {
    $http.put('http://localhost:3000/app/cats/' + cat._id)
      .then((res) => {
        $scope.cats[$scope.cats.indexOf(cat)] = cat;
      }, (err) => {
        console.log(err);
      });
  };
}]);

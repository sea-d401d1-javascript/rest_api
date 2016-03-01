var angular = require('angular');
var blogApp = angular.module('blogApp', []);

require('./blog')(blogApp);
require('./services')(blogApp);

blogApp
// Add Token Middleware
.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
})
  .run(function($window, EE, $rootScope) {
    if ($window.sessionStorage.token && $window.sessionStorage._id) {
      $rootScope.authenticated = true;
    }
  });


//Main Controller
blogApp.controller('MainController', ['$scope', 'EE', '$window', 'Blog',
  function($scope, EE, $window, Blog) {

    // User Authenticated
    $scope.$on('USER_AUTHENTICATED', (id) => {
      // Show blogs
      $scope.showAll = true;
      Blog.getAllPosts().then(function(res) {
        $scope.allPosts = res.data.posts;
      });
    });
  }
]);


blogApp
// Auth Container Controller
.controller('AuthController', ['$scope', '$rootScope', 'EE', '$window', '$timeout',
  function($scope, $rootScope, EE, $window, $timeout) {
    if ($rootScope.authenticated) {
      $timeout(function() {
        EE.emit('USER_AUTHENTICATED', $window.sessionStorage._id);
      }, 100);

    } else {
      $scope.showAuthBox = true;
      $rootScope.authenticated = true;
    }

    $scope.$on('USER_AUTHENTICATED', () => {
      $scope.showAuthBox = false;
    })
  }
])
// Login Controller
.controller('LoginController', ['$scope', '$location', '$window',
  'EE', 'User', '$rootScope',
  function($scope, $location, $window, EE, AuthFactory, $rootScope) {
    // Login function
    $scope.login = function(loginModel) {
      // Call login function from Auth Factory
      AuthFactory.login(loginModel).then(function(res) {
        // Check for token
        if (res.data.token) {
          // Save token
          $window.sessionStorage.token = res.data.token;
          // Save user ID
          $window.sessionStorage._id = res.data.user._id
          // Broadcast event and user ID
          EE.emit('USER_AUTHENTICATED', res.data.user._id);
        } else {
          // Alert no user
          $rootScope.loginMessage = 'No User Found.'
        }
        // Check for error
      }, function(err) {
        $rootScope.loginMessage = err.data.msg;
      });
    };
  }
])
//Register Controller
.controller('RegisterController', ['$scope', '$location', '$window',
  'EE', 'User', '$rootScope',
  function($scope, $location, $window, EE, AuthFactory, $rootScope) {
    // Login function
    $scope.register = function(registerModel) {
      AuthFactory.register(registerModel).then(function(res) {
        if (res.data.token) {
          // Save token
          $window.sessionStorage.token = res.data.token;
          // Save user ID
          $window.sessionStorage._id = res.data.user._id
          // Broadcast event and user ID
          EE.emit('USER_AUTHENTICATED', res.data.user._id);
        } else {
          // Alert no user
          $rootScope.loginMessage = 'Email already registered.'
        }
        // Check for error
      }, function(err) {
        $rootScope.loginMessage = 'There was an error. Please try again.'
      })
    };
  }
])
var angular = require('angular');


var blogApp = angular.module('blogApp', []);

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
blogApp.controller('MainController', ['$scope', 'EE', '$window', 'Post', 'Blog',
  function($scope, EE, $window, Post, Blog) {

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
//Post Functionality
blogApp.controller('PostController', ['$scope', 'EE', '$window', 'Post',
  function($scope, EE, $window, Post) {

    $scope.showNewPost = true;

    $scope.createNewPost = function(post) {
      Post.createNewPost(post).then(function(res) {
        EE.emit('EVENTS_UPDATED', res);
        console.log(res);
      });
    }
  }
]);

// Blog Functionality
blogApp.controller('BlogController', ['$scope', 'EE', '$window', 'Blog',
  function($scope, EE, $window, Blog) {

    // Vars
    $scope.allPosts = {};
    $scope.showBlogs = false;

    //Update Post
    $scope.updatePost = function(post) {
      console.log($scope.allPosts[$scope.allPosts.indexOf(post)]);
      Blog.updatePost(post).then(function(data) {
        console.log(data);
      });
    };

    //Delete Post
    $scope.deletePost = function(index) {
      var toRemove = $scope.allPosts.splice(index, 1);
      Blog.deletePost(toRemove[0]._id).then(function(res) {
        console.log(res);
      });
    };

    // User Authenticated
    $scope.$on('USER_AUTHENTICATED', (id) => {
      // Show blogs
      $scope.showBlogs = true;
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

// Factories
blogApp

.factory('Post', function($http) {
  return {
    baseUrl: 'http://localhost:8080/user',
    createNewPost: function(post) {
      return $http.post(this.baseUrl + '/post', post);
    }
  }
})

.factory('Blog', function($http) {
  return {
    baseUrl: 'http://localhost:8080/user',
    getAllPosts: function() {
      return $http.get(this.baseUrl + '/all')
    },
    updatePost: function(post) {
      return $http.put(this.baseUrl + '/posts/' + post._id, post);
    },
    deletePost: function(id) {
      return $http.delete(this.baseUrl + '/posts/' + id);
    }
  }
})

.factory('User', function($http) {
  return {
    baseUrl: 'http://localhost:8080/user',
    login: function(data) {

      var headerData = data.email + ':' + data.password;
      var headerData = btoa(headerData);

      return $http({
        method: 'GET',
        url: this.baseUrl + '/login',
        headers: {
          authorization: 'Basic ' + headerData
        }
      });
    },
    register: function(data) {
      var toSend = {
        authentication: {
          email: data.email,
          password: data.password
        }
      };

      return $http({
        method: 'POST',
        url: this.baseUrl + '/register',
        data: toSend
      });
    }
  }
})
// Attaches token to evey request
.factory('authInterceptor', function($rootScope, $q, $window) {
  return {
    request: function(req) {
      req.headers = req.headers || {};
      if ($window.sessionStorage.token) {
        // retrieve token from session storage if it exists; store in config object
        req.headers.token = $window.sessionStorage.token;
      }
      return req;
    },
    response: function(response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
})
  .factory('EE', function($rootScope) {
    return {
      emit: function(event, data) {
        $rootScope.$broadcast(event, data);
      }
    }
  })
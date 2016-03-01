module.exports = function(app) {
  app.directive('blogPosts', function() {
    return {
      restrict: 'AEC',
      templateUrl: '/templates/blog/posts.html',
      replace: true,
      controller: function($scope, EE, $window, Blog) {
        // Vars
        $scope.allPosts = {};
        $scope.showBlogs = false;
        //Update Post
        $scope.updatePost = function(post) {
          Blog.updatePost(post).then(function(data) {
          });
        };
        //Delete Post
        $scope.deletePost = function(index) {
          var toRemove = $scope.allPosts.splice(index, 1);
          Blog.deletePost(toRemove[0]._id).then(function(res) {
          });
        };
        // Get users posts
        $scope.getUserPosts = function() {
          Blog.getUserPosts().then(function(res) {
            $scope.allPosts = res.data.posts;
          });
        };
        // User posts on new post
        $scope.$on('EVENTS_UPDATED', function() {
          $scope.getUserPosts();
        });
        // User Authenticated
        $scope.$on('USER_AUTHENTICATED', (id) => {
          // Show blogs
          $scope.showBlogs = true;
          $scope.getUserPosts();
        });
      }
    }
  });
}
module.exports = function(app) {
  app.directive('newPost', function() {
    return {
      restrict: 'AEC',
      replace: true,
      templateUrl: '/templates/blog/new-post.html',
      controller: function($scope, EE, $window, Blog) {

        $scope.showNewPost = true;

        $scope.createNewPost = function(post) {
          Blog.newPost(post).then(function(res) {
            EE.emit('EVENTS_UPDATED', res);
            console.log(res);
          });
        }
      }
    }
  })
}

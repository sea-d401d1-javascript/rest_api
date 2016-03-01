// Blog Service
module.exports = function(app) {
  app.factory('Blog', function($http) {
    return {
      baseUrl: 'http://localhost:8080/user',
      newPost: function(post) {
      	return $http.post(this.baseUrl + '/post', post);
      },
      getAllPosts: function() {
        return $http.get(this.baseUrl + '/all')
      },
      getUserPosts: function() {
        return $http.get(this.baseUrl + '/posts')
      },
      updatePost: function(post) {
        return $http.put(this.baseUrl + '/posts/' + post._id, post);
      },
      deletePost: function(id) {
        return $http.delete(this.baseUrl + '/posts/' + id);
      }
    }
  });
}
module.exports = function(app) {
  app.factory('User', function($http) {
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
}
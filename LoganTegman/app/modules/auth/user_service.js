'use strict';

export default (app) => {
  app.factory('user', ['$http', ($http) => {
    class User {
      constructor() {}

      createUser(user, cb) {
        console.log(user);
        $http.post('http://localhost:3000/api/signup', user)
          .then(cb);
      }

      login(user, cb) {
        $http({
          method: 'GET',
          url: 'http://localhost:3000/api/signin',
          headers: {
            'Authorization': `Basic ${btoa(user.email + ':' + user.password)}`
          }
        })
        .then(cb);
      }

      getUsername() {
        $http.get('http://localhost:3000/api/currentuser');
      }
    }

    return new User();
  }]);
};

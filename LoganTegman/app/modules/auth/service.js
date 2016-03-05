'use strict';

export default (app) => {
  app.factory('auth', ['$window', ($window) => {
    class Auth {
      constructor() {
        this.token = $window.localStorage.jwtToken || null;
        this.username = this.token ? this.parseJWT(this.token).username : null;
      }

      parseJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
      }

      saveToken(token) {
        this.token = token;
        $window.localStorage.jwtToken = token;
      }

      getToken() {
        return this.token || $window.localStorage.jwtToken;
      }

      logout() {
        this.token = null;
        $window.localStorage.removeItem('jwtToken');
      }
    }

    return new Auth();
  }]);
};

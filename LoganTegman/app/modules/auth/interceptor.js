'use strict';

export default (app, API) => {
  app.factory('authInterceptor', ['auth', (auth) => {
    return {
      request(config) {
        const token = auth.getToken();

        if (config.url.includes(API) && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },

      response(res) {
        if (res.data.token) {
          auth.saveToken(res.data.token);
        }

        return res;
      }
    };
  }])
  .config(($httpProvider) => {
    $httpProvider.interceptors.push('authInterceptor');
  });
};

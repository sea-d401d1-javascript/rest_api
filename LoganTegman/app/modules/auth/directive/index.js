'use strict';

export default (app) => {
  app.directive('userWidget', () => {
    return {
      restrict: 'EA',
      templateUrl: '/modules/auth/directive/template.html',
      controller: () => {},
      replace: true
    };
  });
};

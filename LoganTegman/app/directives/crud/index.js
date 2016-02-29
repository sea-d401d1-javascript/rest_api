'use strict';

import crudController from './controller.js';

export default (app) => {
  app.directive('crudDirective', () => {
    return {
      restrict: 'EA',
      templateUrl: '/directives/crud/template.html',
      scope: {
        resourceName: '@'
      },
      controller: crudController,
      replace: true
    };
  });
};

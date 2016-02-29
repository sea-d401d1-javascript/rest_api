'use strict';

import angular from 'angular';
import material from 'angular-material';
import aria from 'angular-aria';
import uiRouter from 'angular-ui-router';
import combinedCtrl from './partials/combined/controller';
import internetzCtrl from './partials/internetz/controller';
import resourceService from './services/resource_service';
import crudDirective from './directives/crud';

const restApp = angular.module('restApp', [material, aria, uiRouter]);
resourceService(restApp);
crudDirective(restApp);

restApp.config(['$stateProvider', '$urlRouterProvider',
  ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('combined', {
        url: '/',
        templateUrl: 'partials/combined/template.html',
        controller: combinedCtrl
      })
      .state('kittens', {
        url: '/kittens',
        template: '<crud-directive resource-name="kittens"></crud-directive>'
      })
      .state('internetz', {
        url: '/internetz',
        templateUrl: 'partials/internetz/template.html',
        controller: internetzCtrl
      });
  }]);

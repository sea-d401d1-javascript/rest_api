'use strict';

import angular from 'angular';
import material from 'angular-material';
import aria from 'angular-aria';
import uiRouter from 'angular-ui-router';
import combinedCtrl from './views/combined/controller';
import resourceService from './services/resource';
import authModule from './modules/auth';
import crudDirective from './directives/crud';

const restApp = angular.module('restApp', [material, aria, uiRouter]);
resourceService(restApp);
authModule(restApp, 'localhost:3000/api');
crudDirective(restApp);

restApp.config(['$stateProvider', '$urlRouterProvider',
  ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('combined', {
        url: '/',
        templateUrl: 'views/combined/template.html',
        controller: combinedCtrl
      })
      .state('kittens', {
        url: '/kittens',
        template: '<crud-directive resource-name="kittens"></crud-directive>'
      })
      .state('internetz', {
        url: '/internetz',
        template: '<crud-directive resource-name="internetz"></crud-directive>'
      });
  }]);

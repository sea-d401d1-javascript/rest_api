'use strict';

/* eslint-env jasmine */

import crudCtrl from '../../app/directives/crud/controller';
const { angular } = window;

describe('crud controller', () => {
  let $httpBackend;
  let $scope;
  let $controller;

  beforeEach(angular.mock.module('restApp'));

  beforeEach(angular.mock.inject(($rootScope, _$controller_) => {
    $controller = _$controller_;
    $scope = $rootScope.$new();
    $scope.resourceName = 'kittens';
  }));

  it('should be able to make a controller', () => {
    const crudController = $controller(crudCtrl, { $scope });
    expect(typeof crudController).toBe('object');
    expect(Array.isArray($scope.items)).toBe(true);
    expect(typeof $scope.getAll).toBe('function');
  });

  describe('rest requests', () => {
    beforeEach(angular.mock.inject((_$httpBackend_) => {
      $httpBackend = _$httpBackend_;
      $controller(crudCtrl, { $scope });
    }));

    it('should make a get request to /api/kittens', () => {
      $httpBackend.expectGET('http://localhost:3000/api/kittens')
        .respond(200, [{ name: 'test kitten' }]);
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.items.length).toBe(1);
      expect($scope.items[0].name).toBe('test kitten');
      expect($scope.loaded).toBe(true);
    });

    it('should be able to create a kitten', () => {
      $httpBackend.expectPOST('http://localhost:3000/api/kittens', {
        name: 'post kitten'
      })
      .respond(200, { name: 'res kitten' });

      $scope.newItem = { name: 'new kitten' };
      $scope.add({ name: 'post kitten' });
      $httpBackend.flush();
      expect($scope.items.length).toBe(1);
      expect($scope.items[0].name).toBe('res kitten');
      expect($scope.newItem).toBe(null);
    });

    it('should be able to edit a kitten', () => {
      $httpBackend.expectPUT('http://localhost:3000/api/kittens/test', {
        _id: 'test',
        name: 'put kitten'
      })
      .respond(200, { msg: 'success' });

      const kitten = {
        _id: 'test',
        name: 'put kitten'
      };

      $scope.edit(kitten);
      $httpBackend.flush();
    });

    it('should be able to delete a kitten', () => {
      $httpBackend.expectDELETE('http://localhost:3000/api/kittens/test')
        .respond(200, { msg: 'success' });
      $scope.items = [{ _id: 'test' }, { _id: 'not test' }];
      $scope.delete({ _id: 'test' });
      $httpBackend.flush();
      expect($scope.items.length).toBe(1);
      expect($scope.items[0]._id).toBe('not test');
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});

'use strict';

/* eslint-env jasmine */

import '../../app/index';
import 'angular-mocks';
import kittensCtrl from '../../app/partials/kittens/controller';
const { angular } = window;

describe('kittens controller', () => {
  let $httpBackend;
  let $scope;
  let $controller;

  beforeEach(angular.mock.module('restApp'));

  beforeEach(angular.mock.inject(($rootScope, _$controller_) => {
    $controller = _$controller_;
    $scope = $rootScope.$new();
  }));

  it('should be able to make a controller', () => {
    const kittensController = $controller(kittensCtrl, { $scope });
    expect(typeof kittensController).toBe('object');
    expect(Array.isArray($scope.kittens)).toBe(true);
    expect(typeof $scope.getKittens).toBe('function');
  });

  describe('rest requests', () => {
    beforeEach(angular.mock.inject((_$httpBackend_) => {
      $httpBackend = _$httpBackend_;
      $controller(kittensCtrl, { $scope });
    }));

    it('should make a get request to /api/kittens', () => {
      $httpBackend.expectGET('http://localhost:3000/api/kittens')
        .respond(200, [{ name: 'test kitten' }]);
      $scope.getKittens();
      $httpBackend.flush();
      expect($scope.kittens.length).toBe(1);
      expect($scope.kittens[0].name).toBe('test kitten');
      expect($scope.loaded).toBe(true);
    });

    it('should be able to create a kitten', () => {
      $httpBackend.expectPOST('http://localhost:3000/api/kittens', {
        name: 'post kitten'
      })
      .respond(200, { name: 'res kitten' });

      $scope.newKitten = { name: 'new kitten' };
      $scope.addKitten({ name: 'post kitten' });
      $httpBackend.flush();
      expect($scope.kittens.length).toBe(1);
      expect($scope.kittens[0].name).toBe('res kitten');
      expect($scope.newKitten).toBe(null);
    });

    it('should be able to edit a kitten', () => {
      $httpBackend.expectPUT('http://localhost:3000/api/kittens/test', {
        _id: 'test',
        name: 'put kitten',
        editing: true
      })
      .respond(200, { msg: 'success' });

      const kitten = {
        _id: 'test',
        name: 'put kitten',
        editing: true
      };

      $scope.editKitten(kitten);
      $httpBackend.flush();
      expect(kitten.editing).toBe(false);
    });

    it('should be able to delete a kitten', () => {
      $httpBackend.expectDELETE('http://localhost:3000/api/kittens/test')
        .respond(200, { msg: 'success' });
      const id = 'test';
      $scope.kittens = [{ _id: 'test' }, { _id: 'not test' }];
      $scope.deleteKitten(id);
      $httpBackend.flush();
      expect($scope.kittens.length).toBe(1);
      expect($scope.kittens[0]._id).toBe('not test');
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });
});

var angular = require('angular');
var template = require('../app/templates/supers/directives/form_directive.html');

describe('form directive', () => {
  var $compile;
  var $rootScope;
  var $httpBackend;

  beforeEach(angular.mock.module('supersApp'));

  beforeEach(angular.mock.inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));

  it('should load the directive', () => {
    $httpBackend.when('GET', '/templates/supers/directives/form_directive.html').respond(200, template);

    var element = $compile('<supers-form data-hero="{}" data-button-text="test button"></supers-form>')($rootScope);
    $httpBackend.flush();
    $rootScope.$digest();
    expect(element.html()).toContain('test button');
  });

  it('should be able to call a passed save function', () => {
    var scope = $rootScope.$new();
    $httpBackend.when('GET', '/templates/supers/directives/form_directive.html').respond(200, template);
    var called = false;
    scope.super = {name: 'inside scope'};

    scope.testSave = function(input) {
      expect(input.name).toBe('from directive');
      scope.super = input;
      called = true;
    };

    var element = $compile('<supers-form data-super="{name: \'inside directive\'}" data-save=testSave></supers-form>')(scope);
    $httpBackend.flush();
    $rootScope.$digest();

    element.isolateScope().save(scope)({name: 'from directive'});
    expect(called).toBe(true);
    expect(scope.super.name).toBe('from directive');
  });
});

var angular = require('angular');

describe('Auth Service', () => {
  beforeEach(angular.mock.module('blogApp'));
  // Vars
  var $httpBackend;
  var UserService;

  // Mock
  beforeEach(angular.mock.inject(function(_$httpBackend_, User) {
    $httpBackend = _$httpBackend_;
    UserService = User;
  }));

  // Check for unfullfiled requests
  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ====== Start Service Tests ===== //

  // Check service type
  it('Should be a service', () => {
    expect(typeof UserService).toBe('object');
  });

  // Get all Blog Posts
  it('Should retreive a token if the user exists', () => {
    var called = false;
    // Test user
     var toSend = {
      email: 'SamHeutmaker123@gmail.com',
      password: 'anotherone'
    };
    // Expect Request
    $httpBackend.expectGET('http://localhost:8080/user/login').respond(200, {
      user: {
        'authentication.email': 'SamHeutmaker123@gmail.com'
      },
      token: 'qwerty'
    });
    // Make request
    UserService.login(toSend).then(function(res) {
     expect(typeof res.data.user).toBe('object');
      expect(typeof res.data.token).toBe('string');
      called = true;
    }, function(err) {
      expect(err).toBe(null);
    });
    // Check Request
    $httpBackend.flush();
    expect(called).toBe(true);
  });

  // Create new post
  it('Should create a new user on POST', () => {
    var called = false;
    // Text User

    var toSend = {
      email: 'SamHeutmaker123@gmail.com',
      password: 'anotherone'
    }

    // Expect Request
    $httpBackend.expectPOST('http://localhost:8080/user/register', {authentication: {
      email: 'SamHeutmaker123@gmail.com',
      password: 'anotherone'
    }}).respond(200, {
      user: {
        'authentication.email': 'SamHeutmaker123@gmail.com'
      },
      token: 'qwerty'
    });

    // Make request
    UserService.register(toSend).then(function(res) {
      expect(typeof res.data.user).toBe('object');
      expect(typeof res.data.token).toBe('string');
      called = true;
    }, function(err) {
      expect(err).toBe(null);
    });

    // Flush
    $httpBackend.flush();
    expect(called).toBe(true);

  });
});
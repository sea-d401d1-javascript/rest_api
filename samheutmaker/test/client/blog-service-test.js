var angular = require('angular');

describe('Blog Service', () => {
  beforeEach(angular.mock.module('blogApp'));
  // Vars
  var $httpBackend;
  var BlogService;

  // Mock
  beforeEach(angular.mock.inject(function(_$httpBackend_, Blog) {
    $httpBackend = _$httpBackend_;
    BlogService = Blog;
  }));

  // Check for unfullfiled requests
  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ====== Start Service Tests ===== //

  // Check service type
  it('Should be a service', () => {
    expect(typeof BlogService).toBe('object');
  });

  // Get all Blog Posts
  it('Should get all the posts in the DB', () => {
    var called = false;
    // Expect Request
    $httpBackend.expectGET('http://localhost:8080/user/all').respond(200, [{
      title: 'Sick Post',
      content: 'Another one'
    }]);
    // Make request
    BlogService.getAllPosts().then(function(res) {
      expect(res).not.toBe(null);
      expect(res.data.length).toBe(1);
      called = true;
    }, function(err) {
      expect(err).toBe(null);
    });
    // Check Request
    $httpBackend.flush();
    expect(called).toBe(true);
  });

  // Create new post
  it('Should create a new blog post', () => {
    var called = false;
    // Expect Request
    $httpBackend.expectPOST('http://localhost:8080/user/post', {
      'title': 'new post',
      'content': 'another one'
    }).respond(200, {
      title: 'newer post',
      content: 'new content'
    });

    // Make request
    BlogService.newPost({
      'title': 'new post',
      'content': 'another one'
    }).then(function(res) {
      expect(res.data.title).toBe('newer post');
      called = true;
    }, function(err) {
      expect(err).toBe(null);
    });

    // Flush
    $httpBackend.flush();
    expect(called).toBe(true);

  });
  
  // Edit Post
  it('Should edit a post', () => {
    var valled = false;
    var testPost = {
      title: 'test title',
      _id: 1
    };
    // Expect Request
    $httpBackend.expectPUT('http://localhost:8080/user/posts/1', testPost)
      .respond(200);
    // Expect Request
    BlogService.updatePost(testPost).then(function(res) {
      called = true;
      expect(res).not.toBe(null);
    }, function(err) {
      expect(err).toBe(null);
    });

    // Flush
    $httpBackend.flush();
    expect(called).toBe(true);
  });

  // Delete Post
  it('Should delete a post', () => {
    var called = false;
    var testPost = {
      title: 'Test Post ',
      _id: 1
    };
    // Expect Request
    $httpBackend.expectDELETE('http://localhost:8080/user/posts/1')
      .respond(200);
    // Make Request
    BlogService.deletePost(testPost._id).then(function(res) {
      expect(res).not.toBe(null);
      called = true;
    }, function(err) {
      expect(err).toBe(null);
    });

    // Flush
    $httpBackend.flush();
    expect(called).toBe(true);
  });
});
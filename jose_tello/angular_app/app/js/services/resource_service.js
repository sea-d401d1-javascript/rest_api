const handleSuccess = require(__dirname + '/handle_success');
const handleFailure = require(__dirname + '/handle_failure');

module.exports = exports = function(app) {
  app.factory('catResource', ['$http', function($http) {
    var Resource = function(resourceName) {
      this.resourceName = resourceName;
    };

    Resource.prototype.getAll = function(cb) {
      $http.get('http://localhost:3000/app' + this.resourceName)
        .then(handleSuccess(cb), handleFailure(cb));
    };

    Resource.prototype.create = function(data, cb) {
      $http.post('http://localhost:3000/app' + this.resourceName, data)
        .then(handleSuccess(cb), handleFailure(cb));
    };

    Resource.prototype.update = function(data, cb) {
      $http.put('http://localhost:3000/app' + this.resourceName + '/' + data._id, data)
        .then(handleSuccess(cb), handleFailure(cb));
    };

    Resource.prototype.delete = function(data, cb) {
      $http.delete('http://localhost:3000/app' + this.resourceName + '/' + data._id)
        .then(handleSuccess(cb), handleFailure(cb));
    };

    return function(resourceName) {
      return new Resource(resourceName);
    };
  }]);
};

var handleSuccess = function(callback) {
	return function(res) {
		callback(null, res.data);
	}
};

var handleFailure = function(callback) {
	return function(res) {
    callback(res);
	}
};

module.exports = exports = function(app) {
	app.factory('cfResource', ['$http', function($http) {
		var Resource = function(resourceName) {
			this.resourceName = resourceName;
		};

    Resource.prototype.getAll = function(callback) {
      $http.get('http://localhost:3000/api' + this.resourceName)
        .then(handleSuccess(callback), handleFailure(callback));
    };


    Resource.prototype.create = function(postData, callback) {
      $http.post('http://localhost:3000/api' + this.resourceName, postData)
        .then(handleSuccess(callback), handleFailure(callback));
    };

    Resource.prototype.delete = function(postData, callback) {
      $http.delete('http://localhost:3000/api' + this.resourceName + '/' + postData._id)
        .then(handleSuccess(callback), handleFailure(callback));
    };


    Resource.prototype.update = function(postData, callback) {
      $http.put('http://localhost:3000/api' + this.resourceName + '/' + postData._id, postData)
        .then(handleSuccess(callback), handleFailure(callback));
    };

	  return function(resourceName) {
			return new Resource(resourceName);
		};
	}]);
};

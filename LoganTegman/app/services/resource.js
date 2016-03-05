'use strict';

const handleSuccess = (cb) => {
  return (res) => {
    cb(null, res.data);
  };
};

const handleFailure = (cb) => {
  return (res) => {
    cb(res);
  };
};

export default (app) => {
  app.factory('Resource', ['$http', ($http) => {
    class Resource {
      constructor(resourceName) {
        this.resourceName = resourceName;
      }

      getAll(cb) {
        $http.get(`http://localhost:3000/api${this.resourceName}`)
          .then(handleSuccess(cb), handleFailure(cb));
      }

      create(data, cb) {
        $http.post(`http://localhost:3000/api${this.resourceName}`, data)
          .then(handleSuccess(cb), handleFailure(cb));
      }

      update(data, cb) {
        $http.put(`http://localhost:3000/api${this.resourceName}/${data._id}`,
          data)
            .then(handleSuccess(cb), handleFailure(cb));
      }

      delete(data, cb) {
        $http.delete('http://localhost:3000/api' + this.resourceName + '/' +
          data._id, data)
            .then(handleSuccess(cb), handleFailure(cb));
      }
    }

    return Resource;
  }]);
};

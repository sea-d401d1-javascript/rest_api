'use strict';

export default ['$scope', 'Resource', ($scope, Resource) => {
  $scope.items = [];
  $scope.loaded = false;
  $scope.newItem = {};

  $scope.filterMongoFields = (item) => {
    const objCopy = { ...item };
    delete item._id;
    delete item.__v;
    return objCopy;
  };

  const resourceInstance = new Resource(`/${$scope.resourceName}`);

  $scope.getAll = () => {
    resourceInstance.getAll((err, data) => {
      if (err) return console.log(err);
      $scope.items = data;
      $scope.loaded = true;
    });
  };
  $scope.add = (item) => {
    resourceInstance.create(item, (err, data) => {
      if (err) return console.log(err);
      $scope.items.push(data);
      $scope.newItem = null;
    });
  };
  $scope.delete = (item) => {
    resourceInstance.delete(item, (err) => {
      if (err) return console.log(err);
      $scope.items = $scope.items.filter((curr) => curr._id !== item._id);
    });
  };
  $scope.edit = (item) => {
    resourceInstance.update(item, (err) => {
      if (err) return console.log(err);
      item.editing = false;
    });
  };
}];

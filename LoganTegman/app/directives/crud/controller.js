'use strict';

export default ['$scope', '$mdMedia', '$mdDialog', '$mdToast', 'Resource',
  ($scope, $mdMedia, $mdDialog, $mdToast, Resource) => {
    $scope.items = [];
    $scope.loaded = false;
    $scope.newItem = {};
    $scope.customFullScreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.editingIndex = null;

    $scope.filterMongoFields = (item) => {
      const objCopy = { ...item };
      delete objCopy._id;
      delete objCopy.__v;
      delete objCopy.backup;
      return objCopy;
    };

    $scope.openErrorToast = (err, text) => {
      console.log(err);
      $mdToast.show($mdToast.simple().textContent(text || err));
    };

    $scope.showEdit = (ev, item, index) => {
      const newScope = $scope.$new();
      newScope.item = { ...item };
      newScope.index = index;
      $mdDialog.show({
        targetEvent: ev,
        clickOutsideToClose: false,
        templateUrl: '/directives/crud/form.tmpl.html',
        scope: newScope
      })
      .catch(() => {
        $scope.hideEdit();
      });
    };

    $scope.submitEdit = (item, index) => {
      $scope.edit(item);
      $scope.items.splice(index, 1, item);
      $mdDialog.hide();
    };

    $scope.hideEdit = () => {
      $mdDialog.hide();
    };

    const resourceInstance = new Resource(`/${$scope.resourceName}`);

    $scope.getAll = () => {
      resourceInstance.getAll((err, data) => {
        if (err) return $scope.openErrorToast(err, 'Get failed');
        $scope.items = data;
        $scope.loaded = true;
      });
    };
    $scope.add = (item) => {
      resourceInstance.create(item, (err, data) => {
        if (err) return $scope.openErrorToast(err, 'Add failed');
        $scope.items.push(data);
        $scope.newItem = null;
      });
    };
    $scope.delete = (item) => {
      resourceInstance.delete(item, (err) => {
        if (err) return $scope.openErrorToast(err, 'Delete failed');
        $scope.items = $scope.items.filter((curr) => curr._id !== item._id);
      });
    };
    $scope.edit = (item) => {
      resourceInstance.update(item, (err) => {
        if (err) return $scope.openErrorToast(err, 'Update failed');
      });
    };
}];

module.exports = function(app) {
  app.directive('supersForm', function() {
    return {
    	restrict: 'EAC',
      replace: true,
      scope: {
    	  buttonText: '@',
    	  super: '=',
    	  save: '&'
    	},
    	controller: function($scope) {
    		$scope.hero = $scope.hero || {};
    	}
    };
  });
};

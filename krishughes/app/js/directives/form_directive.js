module.exports = function(app) {
  app.directive('supersForm', function() {
    return {
    	restrict: 'EAC',
      replace: true,
      transclude: true,
      templateUrl: '/templates/supers/directives/form_directive.html',
      scope: {
    	  buttonText: '@',
    	  super: '=',
    	  save: '&'
    	}
      // controller: function($scope) {
      //   $scope.hero = $scope.hero || {};
      // }
    };
  });
};

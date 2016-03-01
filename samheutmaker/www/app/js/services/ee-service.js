// Event Emitter Service
module.exports = function(app) {
  app.factory('EE', function($rootScope) {
    return {
      emit: function(event, data) {
        $rootScope.$broadcast(event, data);
      }
    }
  });
}
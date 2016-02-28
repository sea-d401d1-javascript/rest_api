const angular = require('angular');
const supersApp = angular.module('supersApp', []);
require(__dirname + '/services/resource_service')(supersApp);

require('./services')(supersApp);

require('./heroes')(supersApp);
require('./villains')(supersApp);
require('./directives/form_directive')(supersApp);

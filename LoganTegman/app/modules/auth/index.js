// This auth scheme is inspired by the angular auth tutorial at
// https://thinkster.io/angularjs-jwt-auth

'use strict';

import service from './service';
import interceptor from './interceptor';
import directive from './directive';

export default (app, API) => {
  service(app);
  interceptor(app, API);
  directive(app);
};

// This auth scheme is inspired by the angular auth tutorial at
// https://thinkster.io/angularjs-jwt-auth

'use strict';

import authSvc from './auth_service';
import interceptor from './interceptor';
import directive from './directive';
import userSvc from './user_service';

export default (app, API) => {
  authSvc(app);
  userSvc(app);
  interceptor(app, API);
  directive(app);
};

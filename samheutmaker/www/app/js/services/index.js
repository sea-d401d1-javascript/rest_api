module.exports = function(app) {
  require('./blog-service')(app);
  require('./ee-service')(app);
  require('./auth-service')(app);
  require('./auth-interceptor')(app);
}
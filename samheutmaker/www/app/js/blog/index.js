module.exports = function(app) {
	require('./directives/posts')(app);
	require('./directives/new-post')(app);
};
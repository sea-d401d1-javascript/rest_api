module.exports = exports = function(cb) {
  return function(res) {
    cb(null, res.data);
  };
};

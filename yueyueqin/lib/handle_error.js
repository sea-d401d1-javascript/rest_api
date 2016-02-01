module.exports = exports = function(err,res){
  console.log(err);
  if (typeof err === 'object') return res.status(400).json(err);
  return res.status(500).json({msg: 'server error'});
};

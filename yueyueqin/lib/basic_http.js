const zeroBuffer = require(__dirname + '/zero_buffer');

module.exports = exports = function(req, res, next){
  try{
    var authString = req.headers.authorization;
    var base64String = authString.split(' ')[1];
    var authBuf = new Buffer(base64String,'base64');
    var utf8AuthString = authBuf.toString();
    var authArr = utf8AuthString.split(':');
    console.log(authArr);
    zeroBuffer(authBuf); //security concern so make buffer 0
    if(authArr[0].length && authArr[1].length){
      req.basicHTTP = {
        email:authArr[0],
        password: authArr[1]
      };
      return next();
    }
  }catch(e){
    console.log(e);
  }
  return res.status(200).json({msg: 'user sign in could not verify'});
};

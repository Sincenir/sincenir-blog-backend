const jwt = require('jsonwebtoken');

//秘钥
var signkey = 'mes_qdhd_mobile';
//生成token
const setToken = function (username) {
  const token = jwt.sign({
    username: username
  }, signkey, { expiresIn: 60 * 60 * 24 * 3 });
  console.log('token', token);
  return token;
}
//验证token
const verToken = function (token) {
  var info = jwt.verify(token, signkey, (error, decoded) => {
    if (error) {
      console.log('token验证失败', error);
      return 'err'
    }
  });
  return info;
}

const JwtUtil = {
  setToken,
  verToken
}
module.exports = JwtUtil

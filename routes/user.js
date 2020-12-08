var express = require('express');
var router = express.Router();
var db = require('../server/db');
// 引入jwt token工具
const JwtUtil = require('../utils/token.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  db.query(`SELECT * FROM user WHERE username=${req.body.username}`)
    .then((result) => {
      if (result.length > 0) {
        res.send({ status: 3, message: '用户名已存在' })
      } else {
        let usre = {
          username: req.body.username,
          password: req.body.password,
          nickname: req.body.nickname,
          power: 6
        }
        db.insert('user', usre)
          .then((result) => {
            res.send({ status: 1, message: '创建成功' })
          }).catch((err) => {
            res.send({ status: 400, message: '创建失败' })
          });
      }
    })
})

router.post('/login', (req, res) => {
  db.query(`SELECT * FROM user WHERE username="${req.body.username}"`)
  .then((result) => {
    if (result) {
      result = result[0]
      console.log(result.password, req.body.password);
      if (result.password == req.body.password) {
        const token = JwtUtil.setToken(result.username);
        res.send({ status: 1, msg: '登陆成功', token: token, data: result });
      } else {
        res.send("密码错误")
      }
    } else {
      res.send("用户未注册")
    }
  }).catch((err) => {
    console.log(err);
    res.send({ status: 400, message: '创建失败' })
  });
})

module.exports = router;

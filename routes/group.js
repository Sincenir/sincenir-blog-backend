var express = require('express');
var router = express.Router();
var db = require('../server/db');

function dataToTree(data) {
  let newData = [];
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (element.level == 1) {
      element.children = getChild(data, element.id);
      newData.push(element);
    }
  }
  return newData;
}

function getChild(data, parentId) {
  let newData = [];
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (element.parent_id == parentId) {
      element.children = getChild(data, element.id);
      newData.push(element);
    }
  }
  return newData;
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/getAll', (req, res) => {
  db.query("SELECT * FROM blog_group")
    .then((result) => {
      let data = dataToTree(result)
      res.send(data);
    }).catch((err) => {
    });
})

router.post('/create', function (req, res) {
  db.insert({ table: "blog_group", datas: req.body })
    .then((result) => {
      db.query(`SELECT * FROM blog_group WHERE id=${result.insertId}`)
        .then((result) => {
          res.send(result);
        })
    }).catch((err) => {
    });
})


module.exports = router;

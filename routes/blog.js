var express = require('express');
var router = express.Router();
var db = require('../server/db');
let util = require('../utils/index.ts')

function getChildGroup(data, id) {
  id = Number(id);
  let ids = [id];
  function getChild(data, id) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.parent_id == id) {
        ids.push(element.id);
        getChild(data, element.id)
      }
    }
  }
  getChild(data, id);
  return ids;
}


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/create', function (req, res) {
  const submit = {
    name: req.body.name,
    title: req.body.title,
    group_id: req.body.groupId,
  }
  db.insert({ table: "blog", datas: submit })
    .then((result) => {
      db.query(`SELECT * FROM blog WHERE id=${result.insertId}`)
        .then((result) => {
          res.send(result);
        })
    }).catch((err) => {
    });
})

router.post('/update', function (req, res, next) {
  const submit = {
    id: req.body.id,
    name: req.body.name,
    blog: util.doubleQuotationMarkParaphrase(req.body.blog),
    title: req.body.title
  }

  db.update({ table: "blog", sets: submit, where: `id=${req.body.id}` })
    .then((result) => {
      res.send({ status: 1 })
    }).catch((err) => {

      // next(new BusinessError(404, "错误"))
    });
})

router.get('/getAll', (req, res) => {
  db.query("SELECT * FROM blog")
    .then((result) => {
      res.send(result);
    }).catch((err) => {

    });
})

router.get('/getOne', (req, res) => {
  // let groupIds = req.query.id.split(',');
  db.query("SELECT * FROM blog_group")
    .then((result) => {
      let groupIds = getChildGroup(result, req.query.id);
      db.query(`SELECT id,name,title,create_date,update_date,creator FROM blog WHERE group_id in (${groupIds.join(',')})`)
        .then((result) => {
          res.send(result)
        }).catch((err) => {
          console.log(err);
        });
    })
})

router.get('/getDetails', (req, res) => {
  db.query(`SELECT * FROM blog WHERE id=${req.query.id}`)
    .then((result) => {
      // result[0].blog = util.doubleQuotationMarkReparaphrase(result[0].blog)
      res.send(result[0])
    }).catch((err) => {
      console.log(err);
    });
})



module.exports = router;

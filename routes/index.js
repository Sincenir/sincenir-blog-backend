var express = require('express');
var router = express.Router();
const db = require('../server/db.js'); //引入封装的db模块


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


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/createBlogGroup', function (req, res) {
  db.insert({ table: "blog_group", datas: req.body })
    .then((result) => {
      res.send('Got a POST request')
    }).catch((err) => {
    });
})

router.post('/createBlog', function(req, res) {
  const submit = {
    name: req.body.name,
    title: req.body.title,
    group_id: req.body.groupId,
  }
  db.insert({table: "blog", datas: submit})
  .then((result) => {
    db.query(`SELECT * FROM blog WHERE id=${result.insertId}`)
    .then((result) => {
      res.send(JSON.parse(JSON.stringify(result)));
    }).catch((err) => {
      
    });
  }).catch((err) => {
  });
})

router.post('/updateBlog', function (req, res) {
  const submit = {
    id: req.body.id,
    name: req.body.name,
    blog: req.body.blog,
    title: req.body.title
  }
  db.update({table: "blog", sets: submit, where: `id=${req.body.id}`})
  .then((result) => {
    res.send({status: 1})
  }).catch((err) => {
  });
})

router.get('/getGroups', (req, res) => {
  db.query("SELECT * FROM blog_group")
    .then((result) => {
      let data = dataToTree(JSON.parse(JSON.stringify(result)))
      res.send(data);
    }).catch((err) => {

    });

})

router.get('/getBlogs', (req, res) => {
  db.query("SELECT * FROM blog")
    .then((result) => {
      res.send(JSON.parse(JSON.stringify(result)));
    }).catch((err) => {

    });
})

router.get('/getBlog', (req, res) => {
  // let groupIds = req.query.id.split(',');
  db.query("SELECT * FROM blog_group")
    .then((result) => {
      let groupIds = getChildGroup(JSON.parse(JSON.stringify(result)), req.query.id);
      db.query(`SELECT id,name,title,create_date,update_date,creator FROM blog WHERE group_id in (${groupIds.join(',')})`)
        .then((result) => {
          res.send(JSON.parse(JSON.stringify(result)))
        }).catch((err) => {
          console.log(err);
        });
    })
})

router.get('/getBlogDetails', (req, res) => {
  db.query(`SELECT * FROM blog WHERE id=${req.query.id}`)
    .then((result) => {
      res.send(JSON.parse(JSON.stringify(result))[0])
    }).catch((err) => {
      console.log(err);
    });
})

// router.get('/', (req, res) => {
//   res.send("hello word");
// })


// router.post('/', (req, res) => {
//   res.send("Got a POST request");
// })?

module.exports = router;

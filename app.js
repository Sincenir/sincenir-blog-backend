var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const db = require('./server/db.js'); //引入封装的db模块

var app = express();

// var mysql = require('mysql');

// var connection = mysql.createConnection({
//     host: '39.106.83.197',
//     user: 'root',
//     password: 'zxcv123.',
//     database: 'sincenir-blog'
// })

// connection.connect();

// connection.query('SELECT * from blog', function (err, data, fields) {
//     if (err) {
//         console.log(err);
//         return;
//     };

//     console.log(data);
// });

// connection.end();

let blogs = [
    {
        id: 1,
        name: "性能优化",
        filePath: "javaScript/性能优化.html",
        createDate: 100,
        updateDate: 100,
        creator: "樊鹏飞",
        groupId: 2
    }, {
        id: 2,
        name: "可选表达式",
        filePath: "javaScript/ES6/可选表达式.html",
        createDate: 100,
        updateDate: 100,
        creator: "樊鹏飞",
        groupId: 3
    }, {
        id: 3,
        name: "promise",
        filePath: "javaScript/ES6/promise.html",
        createDate: 100,
        updateDate: 100,
        creator: "樊鹏飞",
        groupId: 3
    }, {
        id: 4,
        name: "内存泄漏",
        filePath: "javaScript/内存泄漏.html",
        createDate: 100,
        updateDate: 100,
        creator: "樊鹏飞",
        groupId: 2
    },
]

// let groups = [
//     {
//         id: 1,
//         name: "前端",
//         parentId: -1,
//         level: 1
//     },{
//         id: 2,
//         name: "javaScript",
//         parentId: 1,
//         level: 2
//     },{
//         id: 3,
//         name: "ES6",
//         parentId: 2,
//         level: 3
//     },{
//         id: 1,
//         name: "前端",
//         parentId: -1,
//         level: 1
//     },
// ]

let groups = [
    {
        id: 1,
        name: "前端",
        parentId: -1,
        level: 1,
        children: [
            {
                id: 2,
                name: "javaScript",
                parentId: 1,
                level: 2,
                children: [
                    {
                        id: 3,
                        name: "ES6",
                        parentId: 2,
                        level: 3
                    }
                ]
            }
        ]
    }
]

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.get('/getGroups', (req, res) => {
    db.query("SELECT * from blog_grop;")
    .then((result) => {
        const dataString = JSON.stringify(result);
        const data = JSON.parse(dataString);
        res.send(data);
    }).catch((err) => {
        console.log(err);
        res.send("error");
    });
})

app.get('/getBlogs', (req, res) => {
    res.send(blogs);
})

app.get('/getBlog', (req, res) => {
    let groupId = req.query.id;
    console.log(groupId);
    const tmpBlogs = [];
    for (let index = 0; index < blogs.length; index++) {
        const element = blogs[index];
        if (element.groupId === Number(groupId)) {
            tmpBlogs.push(element)
        }
    }
    res.send(tmpBlogs)
})

app.get('/', (req, res) => {
    res.send("hello word");
})


app.post('/', (req, res) => {
    res.send("Got a POST request");
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;



// let routerIds = [];

// // 进入页面 1
// routerIds.push(1); // [1]

// // 进入页面 3
// routerIds.push(3); // [1, 3]

// // 进入页面 5
// routerIds.push(5); // [1, 3, 5]

// // 进入页面 3
// if (currentId === routerIds[routerIds.length - 2]) {
//     // 是回退
//     routerIds.pop()
// }

// // 进入页面 1
// if (currentId === routerIds[routerIds.length - 2]) {
//     // 是回退
//     routerIds.pop()
// }
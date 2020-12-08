var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var blogRouter = require('./routes/blog');
var groupRouter = require('./routes/group');
const JwtUtil = require('./utils/token.js');


var app = express();


app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Access-Control-Allow-Credentials", "true");

    // 验证 token
    if (req.url != `/user/login` && req.url != '/user/register') {
        let token = req.headers.authorization;
        let result = JwtUtil.verToken(token);
        if (result == 'err') {
            res.send({status: 403, message: '登录已过期,请重新登录'});
            // next();
        } else {
            next();
        }
    } else {
        next();
    }
    // next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.use('/group', groupRouter);

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
    // res.status(err.status || 500);
    console.log(err);
    res.status(err.status || 500).send({ error: 'Something blew up!' });
    // res.send({ error: 'Something blew up!' });
    // res.render('error', {error: err});
});



module.exports = app;

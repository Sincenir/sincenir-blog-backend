var express = require('express');
var router = express.Router();
// const db = require('../server/db.js'); //引入封装的db模块

// let util = require('../utils/index.ts')
// import { doubleQuotationMarkParaphrase, doubleQuotationMarkReparaphrase } from '../utils';

// 接收上传的图片
let formidable = require('./node_modules/formidable');

router.post('/upload/blog/image', (req, res) => {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname + "/../file/blog/upload/image");
    form.keepExtensions = true;//保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;
    //处理图片
    form.parse(req, function (err, fields, files){
        console.log(files.the_file);
        var filename = files.the_file.name
        var nameArray = filename.split('.');
        var type = nameArray[nameArray.length - 1];
        var name = '';
        for (var i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
        }
        var date = new Date();
        var time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "_" + date.getHours() + "_" + date.getMinutes();
        var avatarName = name + time + '.' + type;
        var newPath = form.uploadDir + "/" + avatarName;
        fs.renameSync(files.the_file.path, newPath);  //重命名
        res.send({data:"/upload/"+avatarName})
    })
})

module.exports = router;
var express = require('express');
var multer = require('multer');   //用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件
var router = express.Router();
const models = require('./db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 所有接口的拦截，如果有请求 那么更新登录cookie状态
router.all("/*", function (req, res, next) {
  if (req.cookies.userId) {
    res.cookie('userId', req.cookies.userId, {
      path: '/',
      maxAge: 1000 * 60 * 60
    })
    res.cookie('userName', req.cookies.userName, {
      path: '/',
      maxAge: 1000 * 60 * 60
    })
  }
  next()
})


//上传图片
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    var str = file.originalname.split('.');
    cb(null, str[0] + '-' + Date.now() + '.' + str[1]);
  }
})

var upload = multer({storage: storage});
var uploadCheck = multer().single('avatar')
router.post("/upLoadImage", upload.array("file", 20), function (req, res, next) {
  var arr = [];
  for (let i in req.files) {
    arr.push(req.files[i].filename)
  }
  res.json({
    code: 0,
    imageList: arr
  })
  // uploadCheck(req1, res1, function (err) {
  //   if (err instanceof multer.MulterError) {
  //     res.json({
  //       status: 1,
  //       message: '图片删除失败'
  //     })
  //   }
  //   else if (err) {
  //     res.json({
  //       status: 1,
  //       message: '图片删除失败'
  //     })
  //   }
  //   else {
      
  //   }
  // })
})

module.exports = router;

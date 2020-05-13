var express = require('express')
var router = express.Router()
var svgCaptcha = require('svg-captcha')  //图形验证码
var User = require('../models/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource')
})

//登录接口
router.post('/login',function (req, res, next) {
    let params = {
        user_name: req.body.user_name.toLowerCase(),
        user_password: req.body.user_password
    }
    let verCode = req.body.verification_code
    
    User.findOne(params, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                message: err.message
            })
        } else {
            if (doc) {
                if (verCode != req.session.randomCode) {
                    res.json({
                        status: 1,
                        message: '验证码错误'
                    })
                } else if (req.session[doc.user_name]) {
                    res.json({
                        status: 1,
                        message: '你的账号在另一处登录'
                    })
                } else {
                    //如果登录成功 服务器存储一个当前用户的session
                    req.session[doc.user_name] = doc._id
                    res.cookie('userId', doc._id, {
                        path: '/',
                        maxAge: 1000 * 60 * 60
                    })
                    res.cookie('userName', doc.user_name, {
                        path: '/',
                        maxAge: 1000 * 60 * 60
                    })
                    res.json({
                        status: '0',
                        message: '登录成功',
                        userInfo: doc
                    })
                }
            } else {
                res.json({
                    status: '1',
                    message: '用户名或密码错误'
                })
            }
        }
    })
})

//验证是否登录
router.get('/checkLogin', function (req, res, next) {
    if (req.cookies.userId) {
        User.findOne({_id: req.cookies.userId}, function (err, doc) {
            if (err) {
                res.cookie("userId", "", {
                    path: '/',
                    maxAge: -1
                })
                res.cookie("userName", "", {
                    path: '/',
                    maxAge: -1
                })
                res.json({
                    status: '1',
                    message: '用户信息失效'
                })
            } else {
                res.json({
                    status: '0',
                    message: '登录成功',
                    userInfo: doc
                })
            }
        })
    } else {
        res.cookie("userId", "", {
            path: '/',
            maxAge: -1
        })
        res.cookie("userName", "", {
            path: '/',
            maxAge: -1
        })
        res.json({
            status: '1',
            message: '用户信息失效'
        })
    }
})

//退出登录
router.post('/loginOut', function (req, res, next) {
    console.log(req.cookies.userName)
    req.session[req.cookies.userName] = ''
    res.cookie("userId", "", {
        path: '/',
        maxAge: -1
    })
    res.cookie("userName", "", {
        path: '/',
        maxAge: -1
    })
	res.json({
        status: '0',
        message: '退出登录成功！'
	})
})


router.get('/getVerCode', function (req, res, next) {
    var code = svgCaptcha.create({
        size: 4,
        width: 80,
        height: 32,
        ignoreChars: '0o1i',  //默认排除的
        fontSize: 30,
        // noise: 5, //干扰线数量
        background: '#cc9966',
        color: true
    })
    req.session['randomCode'] = code.text.toLocaleLowerCase()
    res.json({
        status: 0,
        verCode: code.data
    })
})

module.exports = router

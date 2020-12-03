var express = require('express');
var router = express.Router();
var News = require('../models/news');
var chinaTime = require('china-time');

router.post("/", function (req, res, next) {

});

//查询整个博客的文章
router.post('/queryNews', function (req, res, next) {
    let page = req.body.page,
    pageSize = req.body.pageSize,
    user_id = req.body.user_id
    // 获取数据条数
    News.count({ user_id }).populate('user_id').exec((err, count) => { //查询出结果返回
        News.find({ user_id }).populate('user_id').skip((page - 1) * pageSize).limit(pageSize)
        .exec((err, doc) => {
            if (err) {
                res.json({
                    status: 1,
                    message: '查询不到对应数据'
                })
            }
            else {
                let newsList = []
                doc.forEach(item => {
                    item.user_id = {}
                    newsList.unshift(item)
                })
               
                res.json({
                    status: 0,
                    totalCount: count,
                    newsList
                })
            }
        })
    })
})
/**添加文章 */
router.post('/addArtical', (req, res, next) => {
    new News(
        {
            "title": 'demo小练习订单',
            "time": chinaTime('YYYY-MM-DD HH:mm:ss'),
            "type": 'javascript',
            "content": req.body.content,
            "praise_num": 0,
            "read_num": 0,
            "mes_num": 0,
            "user_id": req.body.user_id,
            "introduce": '牛逼'
        }
    ).save(err => {
        if (err) {
            return res.status(500).send('Server error.')
        }  else {
            res.json({
                status: 0,
                message: '发布成功'
            })
        }
    })
})
///*查看单个文章的详情*/
router.post('/lookDetail', (req, res, next) => {
    News.findOne({
        _id: req.body.id
    }).exec((err, doc) => {
        if (err) {
            res.json({
                status: 1,
                message: "获取文章信息失败"
            })
        } else {
            //增加阅读数
            if (doc) {
                let read_num = doc.read_num + 1
                News.findOneAndUpdate({
                    _id: req.body.id
                }, {
                    read_num: read_num 
                }, { new: true }).exec((err, doc1) => { //new属性true返回修改后的document；false返回原始数据
                    if (err) {
                        res.json({
                            status: 1,
                            message: "获取文章信息失败"
                        })
                    }
                    res.json({
                        status: 0,
                        message: '获取文章信息成功',
                        detailList: doc1
                    })
                })
            } else {
                res.json({
                    status: 1,
                    message: '获取文章信息失败',
                })
            }
        }
    })
})

//添加点赞
router.post('/addPraise', function (req, res, next) {
    News.findOne({
        _id: req.body.id
    }).exec((err, doc) => {
        if (err) {
            res.json({
                status: 1,
                message: "点赞失败"
            })
        } else {
            //增加点赞数
            if (doc) {
                let praise_num = doc.praise_num + 1
                News.findOneAndUpdate({
                    _id: req.body.id
                }, {
                    praise_num: praise_num 
                }, { new: true }).exec((err, doc1) => { //new属性true返回修改后的document；false返回原始数据
                    if (err) {
                        res.json({
                            status: 1,
                            message: "点赞失败"
                        })
                    }
                    res.json({
                        status: 0,
                        message: '点赞成功'
                    })
                })
            } else {
                res.json({
                    status: 1,
                    message: '点赞失败'
                })
            }
        }
    })
})

//删除动态
router.post("/delMessage", function (req, res, next) {
    if (req.cookies.userId) {
        News.remove({
            _id: req.body.id
        }).exec((err, doc) => {
            if (err) {
                res.json({
                    status: 1,
                    message: '删除动态失败'
                })
            }
            else {
                res.json({
                    status: 0,
                    message: '删除动态成功'
                })
            }
        })
    }
    else {
        res.json({
            status: 2,
            message: '请先登录'
        })
    }
})


module.exports = router;
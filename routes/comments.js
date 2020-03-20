var express = require('express');
var router = express.Router();
var News = require('../models/news');
var Comments = require('../models/comments');
var chinaTime = require('china-time');

///*查看单个文章的详情*/
router.post('/addComments', (req, res, next) => {
    new Comments(
        {
            "name": "游客留言",
            "author": "head-portrait.png",
            "date": chinaTime('YYYY-MM-DD HH:mm:ss'),
            "content": req.body.content,
            "praise_num": 0,
            "reply_num": 0,
            "news_id": req.body.id,
        }
    ).save(err => {
        if (err) {
            return res.status(500).send('Server error.')
        }  else {
            //增加文章的留言数
            News.findOne({
                _id: req.body.id
            }).exec((err, doc) => {
                if (err) {
                    res.json({
                        status: 1,
                        message: "添加留言失败"
                    })
                } else {
                    //增加留言数
                    if (doc) {
                        let mes_num = doc.mes_num + 1
                        News.findOneAndUpdate({
                            _id: req.body.id
                        }, {
                            mes_num: mes_num 
                        }, { new: true }).exec(err => { //new属性true返回修改后的document；false返回原始数据
                            if (err) {
                                res.json({
                                    status: 1,
                                    message: "添加留言失败"
                                })
                            }
                            res.json({
                                status: 0,
                                message: '添加留言成功',
                            })
                        })
                    } else {
                        res.json({
                            status: 1,
                            message: '添加留言失败',
                        })
                    }
                }
            })
        }
    })
})
//*查看单个文章的评论信息*/
router.post('/queryComments', (req, res, next) => {

    Comments.find({
        news_id: req.body.id
    }).populate('news_id').exec((err, doc) => { //关联news表，根据new_id查询信息
        if (err) {
            res.json({
                status: 1,
                message: "获取评论信息失败"
            })
        } else {
            res.json({
                status: 0,
                message: '获取评论信息成功',
                comments: doc
            })
        }
    })
})
//添加点赞
router.post('/addCommentsPraise', function (req, res, next) {
    Comments.findOne({
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
                Comments.findOneAndUpdate({
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

module.exports = router;
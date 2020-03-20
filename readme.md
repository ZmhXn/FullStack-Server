### node书写过程纪要

#### 目录结构
``` bash
models —— 模型结构;

示例：
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newSchema = new Schema({
    "message": String,
    "time": String,
    "name": String,
    "uid": String   //对应所属用户
})

module.exports = mongoose.model('New',newSchema)

注：New对应的mongodb数据库里面的news表，首字母大写，且去掉s


routes —— 路由、接口编写地方

db.js 连接mongodb数据库，在index.js中引入即可

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/data')

mongoose.connection.on("connected",function () {
	console.log("MongoDB connected success.")
});

mongoose.connection.on("error",function () {
	console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected",function () {
	console.log("MongoDB connected disconnected.")
});

const Models = {}
module.exports = Models;


注：其他router下写的js都需要在app.js中引入，且use
如：
app.js
var index = require('./routes/index');
var news = require('./routes/news');

app.use('/', index);
app.use('/news',news)

这里就定义了 接口的一级路径，
如在users.js中新增了一个login接口
router.post("/login", function (req, res, next) {
    ...
})

在前端调用 就需要使用
axios.post("/users/login/).then(() => {
    ...
})

```

#### mongoose 查询

[查询条件](https://www.jianshu.com/p/554a5bf67b31)
[文档](https://mongoose.shujuwajue.com/guide/queries.html)
[官方文档](https://mongoosejs.com/docs/api.html)

``` bash
分页查询：
find() 查询
limit() 限制显示文档个数
skip() 跳过文档个数

查询条件：
$or　　　　或关系
$nor　　　 或关系取反
$gt　　　　大于
$gte　　　 大于等于
$lt　　　　 小于
$lte　　　  小于等于
$ne            不等于
$in             在多个值范围内
$nin           不在多个值范围内
$all            匹配数组中多个值
$regex　　正则，用于模糊查询
$size　　　匹配数组大小
$maxDistance　　范围查询，距离（基于LBS）
$mod　　   取模运算
$near　　　邻域查询，查询附近的位置（基于LBS）
$exists　　  字段是否存在
$elemMatch　　匹配内数组内的元素
$within　　范围查询（基于LBS）
$box　　　 范围查询，矩形范围（基于LBS）
$center       范围醒询，圆形范围（基于LBS）
$centerSphere　　范围查询，球形范围（基于LBS）
$slice　　　　查询字段集合中的元素（比如从第几个之后，第N到第M个元素）

```

#### mongoose批量写入

``` bash
关键字： insetMany
示例：
let numberList = [];
for (var i = start; i <= end; i++) {
    if (i < 10) {
        i = '00' + i
    }
    else if (i >= 10 && i < 100) {
        i = '0' + i
    }
    numberList.push({
        number: '138' + i,
        type: 0,
        userNumber: ''
    })
}
Numbers.insertMany(numberList, function (err, doc) {
    ...
})


mongoose 唯一键
unique: true //不可以重复 唯一性

示例
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const numberSchema = new Schema({
    number: {
        type: String,
        unique: true    //唯一性
    },  
    // number: String,
    type: Number,    
    userNumber: String, 
},{
    autoIndex : false   //在参数unique的时候 设置autoIndex: false 否则node会抱一个警告  https://mongoosejs.com/docs/guide.html
})

module.exports = mongoose.model('Number',numberSchema)


mongoose 随机获取一个数组
示例：
Numbers.aggregate([
    {
        $match: {type: 0}   //筛选条件
    },
    {
        $sample: {size: size},   //随机数量
    }
])

mongoose 批量更新
Model.updateMany()
示例：
router.post('/details', function (req, res, next) {
    News.find({
        type: 1
    }).updateMany({
        type: 0
    }).exec((err, doc) => {
        ...
    })
})


mongoose 查找并更新一条数据
Model.findOneAndUpdate()   [文档地址](https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate)
示例

 News.findOneAndUpdate({
    _id: req.body.id
}, {
    read_num: read_num 
}, { new: true }).exec((err, doc) => { //new属性true返回修改后的document；false返回原始数据
    if (err) {
        res.json({
            status: 1,
            message: "获取文章信息失败"
        })
    }
    res.json({
        status: 0,
        message: '获取文章信息成功',
        detailList: doc
    })
})
```
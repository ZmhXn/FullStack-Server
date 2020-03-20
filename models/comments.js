const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    "name":  {
        type: String,
        default: "游客留言"
    },
    "author":  {
        type: String,
        default: "head-portrait.png"
    },
    "date": String,
    "content": String,
    "praise_num": Number,
    "reply_num": Number,
    "news_id": { type: mongoose.Schema.Types.ObjectId, ref: 'New' },//这里即为子表的外键，关联主表。  ref后的New代表的是关联表为New的Model。
})

module.exports = mongoose.model('Comment', commentSchema)
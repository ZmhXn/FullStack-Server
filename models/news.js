const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newSchema = new Schema({
    "title": String,
    "time": String,
    "type": String,
    "introduce": String,
    "content": String,
    "praise_num": Number,
    "read_num": Number,
    "mes_num": Number,
    "user_id": { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('New',newSchema)
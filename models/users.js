const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newSchema = new Schema({
    "user_name": String,
    "user_password": String
})

module.exports = mongoose.model('User',newSchema)
const mongoose = require('mongoose')

const s = new mongoose.Schema({
    message: {
        type: String
    },
    button: {
        type: Array
    }
},{versionKey: false})

module.exports = mongoose.model('post',s)
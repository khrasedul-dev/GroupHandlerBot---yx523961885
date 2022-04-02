const mongoose = require('mongoose')

const s = new mongoose.Schema({

    userId: {
        type: Number
    },
    userName: {
        type: String
    },
    name: {
        type: String
    },
    joinDate: {
        type: Date,
        default: Date.now
    }

},{versionKey: false})

module.exports = mongoose.model('user',s)
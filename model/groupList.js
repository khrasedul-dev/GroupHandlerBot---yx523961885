const mongoose = require('mongoose')

const s = new mongoose.Schema({
    groupId: {
        type: String
    }
},{versionKey: false})

module.exports = mongoose.model('groupId',s)
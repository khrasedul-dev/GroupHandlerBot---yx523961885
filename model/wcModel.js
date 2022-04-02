const mongoose = require('mongoose')

const s = new mongoose.Schema({
    welcome_message: {
        type: String
    },
    button: {
        type: Array
    }
    
},{versionKey: false})

module.exports = mongoose.model('welcomeMessage',s)
const mongoose = require('mongoose')

const Schema = mongoose.Schema


const adminSchema = new Schema({
    userName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Admin', adminSchema)
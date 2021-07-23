const mongoose = require('mongoose')

const Schema = mongoose.Schema


const clientSchema = new Schema({
    userName: {
        type: String,
        require: true
    },
    balance: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Client', clientSchema)
const mongoose = require('mongoose')

const Schema = mongoose.Schema


const clientSchema = new Schema({
    userName: {
        type: String,
        require: true,
        trim: true
    },
    balance: {
        type: Number,
        default: 0,
    },
    phone: {
        type: String,
        require: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Client', clientSchema)
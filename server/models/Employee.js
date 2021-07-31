const mongoose = require('mongoose')

const Schema = mongoose.Schema


const employeeSchema = new Schema({
    userName: {
        type: String,
        require: true,
        trim: true
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


module.exports = mongoose.model('Employee', employeeSchema)
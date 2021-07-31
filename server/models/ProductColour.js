const mongoose = require('mongoose')

const Schema = mongoose.Schema


const productColourSchema = new Schema({
    title: {
        type: String,
        require: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('ProductColour', productColourSchema)
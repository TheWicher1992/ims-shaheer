
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    serial: {
        type: String,
        trim: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    colour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductColour'
    },
    price: {
        type: Number
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema)

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
    stock: {
        type: Number,
        default: 0
    },
    physicalStock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
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
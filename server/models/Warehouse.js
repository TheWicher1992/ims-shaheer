const mongoose = require('mongoose')

const Schema = mongoose.Schema


const warehouseSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    totalProducts: {
        type: Number,
        default: 0
    },
    totalStock: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Warehouse', warehouseSchema)
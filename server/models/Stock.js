const mongoose = require('mongoose')

const Schema = mongoose.Schema


const stockSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    warehouse: {
        type: Schema.Types.ObjectId,
        ref: 'Warehouse'
    },
    stock: {
        type: Number
    }
})


module.exports = mongoose.model('Stock', stockSchema)

const mongoose = require('mongoose')

const Schema = mongoose.Schema
//         "Time": "Date",
//         "Product":"Ref Product", 
//         "Quantity":"Number",
//         "Amount":"Number", 
//         "Client":"Ref Client",
//         "Payment":["Partial", "Credit","Full"],
//         "Discount":"Number",
//         "Total":"Number",
//         "Note":"String"

const saleSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number
    },
    totalWithOutDiscount: {
        type: Number
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    payment: {
        type: String,
        enum: ['Partial', 'Credit', 'Full']
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number
    },
    note: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    deliveryStatus: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('Sale', saleSchema)
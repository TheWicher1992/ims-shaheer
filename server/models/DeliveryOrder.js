// "DeliveryOrder":{
//     "Time":"Date",
//     "Supplier":"Ref Supplier",
//     "Product":"Ref Product",
//     "Quantity":"Number",
//     "Location":"String",
//     "Note":"String"
// }
const mongoose = require('mongoose')

const Schema = mongoose.Schema


const deliveryOrderSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number
    },
    location: {
        type: String,
        trim: true
    },
    note: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    }
})



module.exports = mongoose.model('DeliveryOrder', deliveryOrderSchema)
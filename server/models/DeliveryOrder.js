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
        ref: 'Client'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
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
    }
})



module.exports = mongoose.model('DeliveryOrder', deliveryOrderSchema)
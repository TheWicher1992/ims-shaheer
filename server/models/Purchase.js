const mongoose = require('mongoose')

const Schema = mongoose.Schema
// "Purchase":{
//     "Time":"Date",
//     "Product":"Ref Product",
//     "Quantity":"Number",
//     "Amount":"Number",
//     "Client":"Ref Client",
//     "Payment":["Partial", "Credit","Full"],
//     "Note":"String"
// }

const purchaseSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
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
    }
})


module.exports = mongoose.model('Purchase', purchaseSchema)
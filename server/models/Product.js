
const mongoose = require('mongoose')
const Schema = mongoose.Schema


// "Product":{
//     "Title":"String",
//     "Serial":"String",
//     "Brand":"String",
//     "Colour":"String",
//     "Stock":"Number",
//     "Warehouse":"Ref Warehouse"
// }


const productSchema = new Schema({
    title: {
        type: String
    },
    serial: {
        type: String
    },
    brand: {
        type: String
    },
    colour: {
        type: String
    },
    stock: {
        type: Number
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})
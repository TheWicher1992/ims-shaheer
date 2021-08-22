const mongoose = require('mongoose')

const Schema = mongoose.Schema


const paymentSchema = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    cash: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        enum: ['Payed', 'Received']
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Payment', paymentSchema)
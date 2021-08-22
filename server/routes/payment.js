const express = require('express')
const { SERVER_ERROR } = require('../misc/errors')
const router = express.Router()

const Client = require('../models/Client')
const Payment = require('../models/Payment')



router.post('/', async (req, res) => {
    try {
        let {
            clientId,
            cash,
            type
        } = req.body

        cash = parseInt(cash)

        const client = await Client.findOne({
            _id: clientId
        })

        const payment = new Payment({
            client: clientId,
            cash,
            type
        })

        await payment.save()

        if (type === 'Received') client.balance += cash
        else client.balance -= cash

        await client.save()
        return res.json({
            payment
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }

})


router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find()
        return res.json({
            payments
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})











module.exports = router
const express = require('express')
const router = express.Router()
const DeliveryOrder = require('../models/DeliveryOrder')
const config = require('config')
const {
    SERVER_ERROR
} = require('../misc/errors')
// make an order
router.post('/', async (req, res) => {
    try {
        var {
            productID,
            quantity,
            clientID,
            location,
            note,
            date,
        } = req.body



        console.log(req.body)
        const order = new DeliveryOrder({
            product: productID,
            quantity,
            location,
            client: clientID,
            note,
            date,
        })

        await order.save()

        return res.status(200).json({
            order
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})



// view delivery orders

router.get('/', async (req, res) => {
    try {

        const deliveryOrder = await DeliveryOrder.find({}).populate(['product', 'client'])

        return res.status(200).json({
            deliveryOrder
        })
    }
    catch (err) {

        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR

        })
    }
})

// view orders with specific id

router.get('/:id', async (req, res) => {
    try {


        const id = req.params.id

        const deliveryOrder = await DeliveryOrder.findById(id)

        return res.status(200).json({
            deliveryOrder
        })
    }
    catch (err) {
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})



// filter suppliers
router.get('/:page/:query/:client/:product/:date/:sort/:sortBy', async (req, res) => {
    try {
        const page = req.params.page - 1
        const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")

        const date = req.params.date
        const client = req.params.client
        const product = req.params.product

        const sort = req.params.sort === '*' ? 'date' : req.params.sort
        const sortBy = req.params.sortBy === '*' ? 'desc' : req.params.sortBy

        const sortOptions = {
            [sort]: sortBy
        }


        const filters = {}

        if (client !== '*') filters['client'] = client
        if (product !== '*') filters['product'] = product
        if (date !== '*') filters['date'] = date
        const itemsPerPage = config.get('rows-per-page')

        const suppliers = await Client
            .sort(sortOptions)
            .skip(itemsPerPage * page)
            .limit(itemsPerPage)

        return res.status(200).json({
            suppliers
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
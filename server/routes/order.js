const express = require('express')
const router = express.Router()
const DeliveryOrder = require('../models/DeliveryOrder')
const config = require('config')


// view delivery orders

router.get('/', async (req, res) => {
    try {

        const deliveryOrder = await DeliveryOrder.find({})

        return res.status(200).json({
            deliveryOrder
        })
    }
    catch (err) {
        return res.status(400).json({
            error: 'SERVER_ERROR'
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
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})



// filter suppliers
router.get('/:page/:query/:client/:product/:date/:sort/:sortBy', async (req, res) => {

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

})




module.exports = router
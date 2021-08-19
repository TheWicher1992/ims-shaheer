const express = require('express')
const router = express.Router()
const Sale = require('../models/Sale')
const config = require('config')
const errors = require('../misc/errors')


// make a sale
router.post('/', async (req, res) => {
    try {
        var {
            productID,
            quantity,
            totalWithOutDiscount,
            clientID,
            payment,
            discount,
            total,
            note,
            date,
            deliveryStatus
        } = req.body



        console.log(req.body)
        const sale = new Sale({
            product: productID,
            quantity,
            totalWithOutDiscount,
            client: clientID,
            payment,
            discount,
            total,
            note,
            date,
            deliveryStatus
        })

        await sale.save()

        return res.status(200).json({
            sale
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})


// filter sales


router.get('/:page/:query/:client/:deliveryStatus/:date/:quantity/:total/:sort/:sortBy', async (req, res) => {
    try {

        const page = req.params.page - 1
        const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")
        const client = req.params.client
        const deliveryStatus = req.params.deliveryStatus
        const date = req.params.date
        const quantity = req.params.quantity
        const total = req.params.total
        const sort = req.params.sort === '*' ? 'date' : req.params.sort
        const sortBy = req.params.sortBy === '*' ? 'desc' : req.params.sortBy

        const sortOptions = {
            [sort]: sortBy
        }


        const filters = {}

        if (client !== '*') filters['client'] = client
        if (deliveryStatus !== '*') filters['deliveryStatus'] = deliveryStatus
        if (date !== '*') filters['date'] = date
        if (quantity !== '*') filters['quantity'] = quantity
        if (total !== '*') filters['total'] = total



        filters['$or'] = [

            {
                product: {
                    $in: productIDs.map(c => c._id)
                }
            },
            {
                client: {
                    $in: clientIDs.map(b => b._id)
                }
            }
        ]

        const itemsPerPage = config.get('rows-per-page')

        const sales = await Sale
            .find(filters)
            .sort(sortOptions)
            .skip(itemsPerPage * page)
            .limit(itemsPerPage)

        return res.status(200).json({
            sales
        })
    }
    catch (err) {
        console.log(err)

        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})


// view all sales
router.get('/', async (req, res) => {
    try {

        const sale = await Sale.find({}).populate(['product', 'client'])

        return res.status(200).json({
            sale
        })
    }
    catch (err) {
        console.log(err)

        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

// view a specific sale


router.get('/:id', async (req, res) => {
    try {


        const id = req.params.id

        const sale = await Sale.findById(id)

        return res.status(200).json({
            sale
        })
    }
    catch (err) {
        console.log(err)

        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})


// update deliveryStatus

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id

        let sale = await Sale.findOneAndUpdate({ _id: id }, { deliveryStatus: true }, {
            new: true
        })

        await sale.save()

        return res.status(200).json({
            sale
        })

    }
    catch (err) {
        console.log(err)

        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

module.exports = router
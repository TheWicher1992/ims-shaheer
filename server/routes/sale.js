const express = require('express')
const router = express.Router()
const Sale = require('../models/Sale')
const config = require('config')
const errors = require('../misc/errors')
const Client = require('../models/Client')
const Product = require('../models/Product')
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


router.get('/filters', async (req, res) => {
    try {
        const clients = await Client.find().select('userName')
        const products = await Product.find().select('title')
        const maxTotal = (await Sale.find().sort({ total: -1 }).limit(1))[0].total
        const maxQuantity = (await Sale.find().sort({ quantity: -1 }).limit(1))[0].quantity

        const filters = {
            clients,
            products,
            maxTotal,
            maxQuantity
        }

        return res.json({
            filters
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})



// filter sales
router.get('/:page/:query/:products/:clients/:payment/:date/:quantity/:amount', async (req, res) => {
    const page = parseInt(req.params.page) - 1
    const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")
    const quantity = req.params.quantity === '*' ? '*' : parseInt(req.params.quantity)
    const amount = req.params.amount === '*' ? '*' : parseInt(req.params.amount)
    let date = req.params.date
    const payment = req.params.payment
    const products = req.params.products
    const clients = req.params.clients
    const sortOptions = {
        'date': 'desc'
    }
    const filters = {}

    if (products !== '*') filters['product'] = {
        $in: products.split(',').slice(1, products.length)
    }
    if (clients !== '*') filters['client'] = {
        $in: clients.split(',').slice(1, clients.length)
    }

    if (date !== '*') {
        date = date.split('-')
        let month = parseInt(date[0])
        let day = parseInt(date[1])
        let year = parseInt(date[2]) + 2000

        let d1 = new Date(year, month - 1, day)
        let d2 = new Date(year, month - 1, day + 1)
        console.log(d1, d2)
        filters['date'] = {
            $gte: d1,
            $lte: d2
        }
    }

    if (amount !== '*') filters['total'] = {
        $lte: amount
    }
    if (quantity !== '*') filters['quantity'] = {
        $lte: quantity
    }
    if (payment !== '*') filters['payment'] = payment

    const productIDs = await Product.find({
        title: {
            $in: query.map(q => new RegExp(q, "i"))
        }
    }).select('_id')
    console.log(productIDs)
    const clientIDs = await Client.find({
        userName: {
            $in: query.map(q => new RegExp(q, "i"))
        }
    }).select('_id')
    console.log(clientIDs)
    filters['$or'] = [
        {
            payment: {
                $in: query.map(q => new RegExp(q, "i"))
            }
        },
        {
            note: {
                $in: query.map(q => new RegExp(q, "i"))
            }
        },
        {
            client: {
                $in: clientIDs.map(c => c._id)
            }
        },
        {
            product: {
                $in: productIDs.map(p => p._id)
            }
        }
    ]
    const itemsPerPage = config.get('rows-per-page')
    const sales = await Sale
        .find(filters)
        .populate(['product', 'client'])
        .sort(sortOptions)
        .skip(itemsPerPage * page)
        .limit(itemsPerPage)


    return res.json({
        sales
    })

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
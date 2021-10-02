const express = require('express')
const router = express.Router()
const Purchase = require('../models/Purchase')
const Product = require('../models/Product')
const DeliveryOrder = require('../models/DeliveryOrder')
const Warehouse = require('../models/Warehouse')
const Stock = require('../models/Stock')
const Client = require('../models/Client')
const errors = require('../misc/errors')
const config = require('config')
const { SERVER_ERROR } = require('../misc/errors')
router.post('/', async (req, res) => {
    try {
        let {
            product,
            quantity,
            client,
            payment,
            total,
            received,
            note,
            isDeliveryOrder,
            location,
            warehouseID
        } = req.body


        //set received appropriately
        if (payment === 'Credit') received = 0
        if (payment === 'Full') received = total

        //New purchase
        const purchase = new Purchase({
            product,
            quantity,
            client,
            payment,
            total,
            received,
            note
        })


        //if DeliveryOrder
        if (isDeliveryOrder) {
            const deliveryOrder = new DeliveryOrder({
                client,
                product,
                quantity,
                location,
                note
            })
            await deliveryOrder.save()
            purchase.deliveryOrder = deliveryOrder._id
            purchase.typeOfPurchase = 'DeliveryOrder'
        }
        //if physical stock
        else {

            //update warehouse with correct amount of stock and product
            const warehouse = await Warehouse.findOne({
                _id: warehouseID
            })
            purchase.warehouse = warehouseID
            const stock = await Stock.findOne({
                warehouse: warehouseID,
                product
            })

            if (!stock) {
                await new Stock({
                    product,
                    warehouse: warehouseID,
                    stock: quantity
                }).save()
                warehouse.totalProducts += 1
            }
            else {
                stock.stock += parseInt(quantity)
                await stock.save()
            }
            warehouse.totalStock += parseInt(quantity)
            await warehouse.save()
        }

        await purchase.save()


        //Update totalstock
        const prod = await Product.findOne({
            _id: product
        })

        prod.totalStock += parseInt(quantity)

        await prod.save()
        //End update totalstock

        //Update client balance
        const clientDB = await Client.findOne({
            _id: client
        })

        clientDB.balance += parseInt(total) - parseInt(received)

        await clientDB.save()
        //  End update client balance

        return res.status(200).json({
            purchase
        })


    }
    catch (err) {
        console.log("///",err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }

})

router.get(`/`, async (req, res) => {
    try {
        const purchases = await Purchase.find().populate(['client', 'product'])
        return res.status(200).json({
            purchases
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
        const maxTotal = (await Purchase.find().sort({ total: -1 }).limit(1))[0].total
        const maxQuantity = (await Purchase.find().sort({ quantity: -1 }).limit(1))[0].quantity

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
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})

router.get('/form-inputs', async (req, res) => {

    try {

        const clients = await Client.find().select('userName')
        const warehouses = await Warehouse.find().select('name')
        const products = await Product.find().select('title serial')

        return res.json({
            clients, warehouses, products
        })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }


})

router.get(`/:id`, async (req, res) => {

    try {

        id = req.params.id
        const purchases = await Purchase.find({ client: id }).populate(['product', 'client'])
        return res.status(200).json({
            purchases
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }

})

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

    if (amount !== '*') filters['total'] = amount
    if (quantity !== '*') filters['quantity'] = quantity
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
    const purchases = await Purchase
        .find(filters)
        .populate(['product', 'client'])
        .sort(sortOptions)
    // .skip(itemsPerPage * page)
    // .limit(itemsPerPage)


    return res.json({
        purchases
    })

})



router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        let {
            product,
            quantity,
            client,
            payment,
            total,
            received,
            note,
            isDeliveryOrder,
            location,
            warehouseID
        } = req.body

        console.log(req.body)


        //set received appropriately
        if (payment === 'Credit') received = 0
        if (payment === 'Full') received = total

        const purchase = await Purchase.findOne({ _id: id })


        if (purchase.typeOfPurchase == 'DeliveryOrder')
        {
            await DeliveryOrder.deleteOne({
                _id : purchase.deliveryOrder
            })
        }
        else
        {
            const oldWareHouse = await Warehouse.findOne({
                _id: purchase.warehouse
            })
            const oldStock = await Stock.findOne({
                warehouse: purchase.warehouse,
                product: purchase.product
            })

            oldStock.stock -= purchase.quantity
            oldWareHouse.totalStock -= purchase.quantity
            if (oldStock.stock<=0)
            {
                oldWareHouse.totalProducts -= 1
            }
            console.log(oldStock)
            await oldWareHouse.save()
            await oldStock.save()

        }


        
        purchase.product = product
        purchase.quantity = quantity
        purchase.client = client
        purchase.payment = payment
        purchase.total = total
        purchase.received = received
        purchase.note = note
        await purchase.save()
        
        //if DeliveryOrder
        if (isDeliveryOrder) {



            console.log("called")
            const deliveryOrder = new DeliveryOrder({
                client,
                product,
                quantity,
                location,
                note
            })
            await deliveryOrder.save()
            purchase.typeOfPurchase = 'DeliveryOrder'
            purchase.deliveryOrder = deliveryOrder._id


        }
        else {
            console.log("notCalled")
            purchase.typeOfPurchase = 'Warehouse'
            //update warehouse with correct amount of stock and product
            const warehouse = await Warehouse.findOne({
                _id: warehouseID
            })
            const stock = await Stock.findOne({
                warehouse: warehouseID,
                product
            })

            if (!stock) {
                await new Stock({
                    product,
                    warehouse: warehouseID,
                    stock: quantity
                }).save()
                warehouse.totalProducts += 1
            }
            else {
                stock.stock = parseInt(quantity) + parseInt(stock.stock)
                await stock.save()
            }
            warehouse.totalStock = parseInt(quantity) + parseInt(warehouse.totalStock)
            await warehouse.save()
        }

        await purchase.save()


        // //Update totalstock
        const prod = await Product.findOne({
            _id: product
        })

        prod.totalStock = parseInt(quantity) + parseInt(prod.totalStock)

        await prod.save()
        // //End update totalstock

        // //Update client balance
        const clientDB = await Client.findOne({
            _id: client
        })

        clientDB.balance += parseInt(total) - parseInt(received)

        await clientDB.save()
        // //  End update client balance

        return res.status(200).json({
            purchase
        })


    }
    catch (err) {
        console.log('1', err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

module.exports = router
const express = require('express')
const router = express.Router()
const Purchase = require('../models/Purchase')
const Product = require('../models/Product')
const DeliveryOrder = require('../models/DeliveryOrder')
const Warehouse = require('../models/Warehouse')
const Stock = require('../models/Stock')
const Client = require('../models/Client')
const errors = require('../misc/errors')
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
        }
        //if physical stock
        else {

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
                stock.stock += quantity
                await stock.save()
            }
            warehouse.totalStock += quantity
            await warehouse.save()
        }

        await purchase.save()


        //Update totalstock
        const prod = await Product.findOne({
            _id: product
        })

        prod.totalStock += quantity

        await prod.save()
        //End update totalstock

        //Update client balance
        const clientDB = await Client.findOne({
            _id: client
        })

        clientDB.balance = total - received

        await clientDB.save()
        //  End update client balance

        return res.status(200).json({
            purchase
        })


    }
    catch (err) {
        console.log(err)
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
        const products = await Product.find().select('title')

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



// router.put('/:id', async (req, res) => {

//     const {
//         product,
//         quantity,
//         client,
//         payment,
//         total,
//         note,
//         isDeliveryOrder,
//         location,
//         warehouseID
//     } = req.body

//     const purchase = await Purchase.findOne({
//         _id: req.params.id
//     })

//     purchase.product = product
//     purchase.quantity = quantity
//     purchase.client = client
//     purchase.payment = payment
//     purchase.total = total
//     purchase.note = note


//     if (isDeliveryOrder) {
//         const deliveryOrder = new DeliveryOrder({
//             client,
//             product,
//             quantity,
//             location,
//             note
//         })
//         await deliveryOrder.save()
//     }
//     else {
//         const warehouse = await Warehouse.findOne({
//             _id: warehouseID
//         })
//         const stock = await Stock.findOne({
//             warehouse: warehouseID,
//             product
//         })

//         if (!stock) {
//             await new Stock({
//                 product,
//                 warehouse: warehouseID,
//                 stock: quantity
//             }).save()
//         }
//         else {
//             stock.stock += quantity
//         }
//         warehouse.totalStock += quantity
//         await warehouse.save()
//     }

//     await purchase.save()

//     return res.status(200).json({
//         purchase
//     })


// })

module.exports = router
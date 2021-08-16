const express = require('express')
const router = express.Router()
const Purchase = require('../models/Purchase')
const Product = require('../models/Product')
const DeliveryOrder = require('../models/DeliveryOrder')
const Warehouse = require('../models/Warehouse')
const Stock = require('../models/Stock')
router.post('/', async (req, res) => {
    const {
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

    const purchase = new Purchase({
        product,
        quantity,
        client,
        payment,
        total,
        note
    })

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
    else {
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
        }
        else {
            stock.stock += quantity
        }
        warehouse.totalStock += quantity
        await warehouse.save()
    }

    await purchase.save()

    return res.status(200).json({
        purchase
    })



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
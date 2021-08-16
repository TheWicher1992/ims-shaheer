const express = require('express')
const router = express.Router()
const Purchase = require('../models/Purchase')
const Product = require('../models/Product')
const DeliveryOrder = require('../models/DeliveryOrder')
const Warehouse = require('../models/Warehouse')
const Stock = require('../models/Stock')
const Client = require('../models/Client')
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
        }
        else {
            stock.stock += quantity
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
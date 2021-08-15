const express = require('express')
const router = express.Router()
const Purchase = require('../models/Purchase')
const Product = require('../models/Product')
const DeliveryOrder = require('../models/DeliveryOrder')
const Warehouse = require('../models/Warehouse')

router.post('/', async (req, res) => {
    const {
        productID,
        quantity,
        client,
        payment,
        total,
        received,
        note,
        isDeliveryOrder,
        location
    } = req.body

    const purchase = new Purchase({
        product,
        quantity,
        client,
        payment,
        total,
        note
    })


    //Update product stock
    const product = await Product.findOne({
        _id: productID
    })
    product.stock += quantity

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
            _id: product.warehouse
        })
        warehouse.totalStock += quantity
        product.physicalStock += quantity
        await warehouse.save()
    }

    await purchase.save()
    await product.save()

    return res.status(200).json({
        purchase
    })



})



module.exports = router
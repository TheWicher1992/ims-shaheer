const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const Sale = require('../models/Sale')
const config = require('config')
const {
    SERVER_ERROR
} = require('../misc/errors')
router.get('/outOfStock', async (req, res) => {
    try {


        const outOfStock = await Product.count({
            totalStock: 0
        })

        console.log('./././././././', outOfStock)
        return res.status(200).json({
            outOfStock
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})

router.get('/todayRevenue', async (req, res) => {
    try {

        var start = new Date();
        start.setHours(0, 0, 0, 0);

        var end = new Date();
        end.setHours(23, 59, 59, 999)
        const todayRevenue = await Sale.aggregate([
            { $match: { date: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$total" }
                }
            }
        ])
        const todaysRevenue = todayRevenue[0]

        console.log('#/#/#/#/#/#/', todaysRevenue)
        return res.status(200).json({
            todaysRevenue
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})

router.get('/pendingDeliveries', async (req, res) => {
    try {


        const pendingDeliveries = await Sale.count({
            deliveryStatus: false
        })

        return res.status(200).json({
            pendingDeliveries
        })
    }
    catch (err) {
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})

module.exports = router
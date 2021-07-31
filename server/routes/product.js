const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const config = require('config')

router.post('/', async (req, res) => {
    const {
        title,
        serial,
        brand,
        colour,
        stock,
        warehouse,
        description
    } = req.body

    const exists = await Product.exists({
        serial
    })

    if (exists) {
        return res.status(400).json({
            error: 'PRODUCT_ALREADY_EXIST'
        })
    }

    const product = new Product({
        title,
        serial,
        brand,
        colour,
        stock,
        warehouse,
        description
    })

    await product.save()


    return res.status(200).json({
        product
    })
})

router.get('/:id', (req, res) => {
    res.send(`Post with ID ${req.params.id}`)
})

router.get('/:page', async (req, res) => {

    const page = req.params.page - 1
    const itemsPerPage = config.get('rows-per-page')

    const products = await Product.find().skip(itemsPerPage * page).limit(itemsPerPage)

    return res.status(200).json({
        products
    })

})



module.exports = router
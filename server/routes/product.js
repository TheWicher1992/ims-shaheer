const express = require('express')
const router = express.Router()
const ProductColour = require('../models/ProductColour')
const Brand = require('../models/Brand')
const Product = require('../models/Product')
const config = require('config')

router.post('/', async (req, res) => {
    try {
        var {
            title,
            serial,
            brandID,
            colourID,
            description,
            isNewColour,
            newColour,
            isNewBrand,
            newBrand,
            price
        } = req.body

        const exists = await Product.exists({
            serial
        })

        if (exists) {
            return res.status(400).json({
                error: 'PRODUCT_ALREADY_EXIST'
            })
        }

        if (isNewColour) {
            newColour = newColour.toUpperCase()
            let productColour = await ProductColour.findOne({
                title: newColour
            })
            console.log(productColour)
            if (productColour) {
                colourID = productColour._id
            }
            else {
                productColour = new ProductColour({
                    title: newColour
                })
                await productColour.save()
                colourID = productColour._id
            }
        }

        if (isNewBrand) {
            newBrand = newBrand.toUpperCase()
            let brand = await Brand.findOne({
                title: newBrand
            })
            if (brand) {
                brandID = brand._id
            }
            else {
                brand = new Brand({
                    title: newBrand
                })
                await brand.save()
                brandID = brand._id
            }
        }


        const product = new Product({
            title,
            serial,
            brand: brandID,
            colour: colourID,
            description,
            price
        })

        await product.save()

        return res.status(200).json({
            product
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {


        const id = req.params.id

        const product = await Product.findById(id)

        return res.status(200).json({
            product
        })
    }
    catch (err) {
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})

router.get('/:page/:query/:colour/:brand/:warehouse/:sort/:sortBy', async (req, res) => {

    try {



        const page = req.params.page - 1
        const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")
        const colour = req.params.colour
        const brand = req.params.brand
        const warehouse = req.params.warehouse
        const sort = req.params.sort === '*' ? 'date' : req.params.sort
        const sortBy = req.params.sortBy === '*' ? 'desc' : req.params.sortBy

        const sortOptions = {
            [sort]: sortBy
        }


        const filters = {}

        if (brand !== '*') filters['brand'] = brand
        if (colour !== '*') filters['colour'] = colour
        if (warehouse !== '*') filters['warehouse'] = warehouse

        const colourIDs = await ProductColour.find({
            title: {
                $in: query.map(q => new RegExp(q, "i"))
            }
        }).select('_id')

        console.log(colourIDs)

        const brandIDs = await Brand.find({
            title: {
                $in: query.map(q => new RegExp(q, "i"))
            }
        }).select('_id')

        console.log(brandIDs)



        filters['$or'] = [
            {
                title: {
                    $in: query.map(q => new RegExp(q, "i"))
                }
            },
            {
                description: {
                    $in: query.map(q => new RegExp(q, "i"))
                }
            },
            {
                colour: {
                    $in: colourIDs.map(c => c._id)
                }
            },
            {
                brand: {
                    $in: brandIDs.map(b => b._id)
                }
            }
        ]

        const itemsPerPage = config.get('rows-per-page')

        const products = await Product
            .find(filters)
            .sort(sortOptions)
            .skip(itemsPerPage * page)
            .limit(itemsPerPage)

        return res.status(200).json({
            products
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }

})

router.delete('/:id', async (req, res) => {
    try {

        const id = req.params.id

        const exists = await Product.exists({
            _id: id
        })

        if (!exists) {
            return res.status(400).json({
                error: 'PRODUCT_NOT_EXISTENT'
            })
        }

        await Product.deleteOne({
            _id: id
        })

        res.status(200).end()
    } catch (err) {
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        var {
            title,
            serial,
            brandID,
            colourID,
            description,
            isNewColour,
            newColour,
            isNewBrand,
            newBrand,
            price
        } = req.body

        const product = await Product.findOne({
            _id: id
        })

        if (!product) {
            return res.status(400).json({
                error: 'PRODUCT_NOT_EXISTENT'
            })
        }

        if (isNewColour) {
            newColour = newColour.toUpperCase()
            let productColour = await ProductColour.findOne({
                title: newColour
            })
            console.log(productColour)
            if (productColour) {
                colourID = productColour._id
            }
            else {
                productColour = new ProductColour({
                    title: newColour
                })
                await productColour.save()
                colourID = productColour._id
            }
        }

        if (isNewBrand) {
            newBrand = newBrand.toUpperCase()
            let brand = await Brand.findOne({
                title: newBrand
            })
            if (brand) {
                brandID = brand._id
            }
            else {
                brand = new Brand({
                    title: newBrand
                })
                await brand.save()
                brandID = brand._id
            }
        }

        product.title = title
        product.serial = serial
        product.brand = brandID
        product.colour = colourID
        product.price = price
        product.description = description

        await product.save()

        return res.status(200).json({
            product
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})

module.exports = router
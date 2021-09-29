const express = require('express')
const router = express.Router()
const ProductColour = require('../models/ProductColour')
const Brand = require('../models/Brand')
const Product = require('../models/Product')
const config = require('config')
const Warehouse = require('../models/Warehouse')
const Stock = require('../models/Stock')
const DeliveryOrder = require('../models/DeliveryOrder')
const errors = require('../misc/errors')
const moment = require('moment')

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
            price,
            warehouse,
            stock
        } = req.body

        const exists = await Product.exists({
            serial
        })

        if (exists) {
            return res.status(400).json({
                error: errors.PRODUCT_ALREADY_EXIST
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

        const brandName = await Brand.findOne({
            _id: brandID
        })
        const colourName = await ProductColour.findOne({
            _id: colourID
        })

        const product = new Product({
            title: `${title}-${brandName.title}-${colourName.title}`,
            serial,
            brand: brandID,
            colour: colourID,
            description,
            price
        })

        if (warehouse !== "*") {
            const ware = await Warehouse.findOne({
                _id: warehouse
            })

            await new Stock({
                product: product._id,
                warehouse,
                stock
            }).save()
            ware.totalProducts += 1
            ware.totalStock += stock
            await ware.save()
            product.totalStock = stock
        }

        await product.save()

        return res.status(200).json({
            product
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

const moveDeliveryToWarehouse = async (sourceID, destID, productID) => {

    //update delivery status
    const deliverOrder = await DeliveryOrder.findOne({
        _id: sourceID
    })
    deliverOrder.status = true
    await deliverOrder.save()

    //update warehouse totalStock
    const warehouse = await Warehouse.findOne({
        _id: destID
    })
    console.log(warehouse)
    const stock = await Stock.findOne({
        warehouse: destID,
        product: productID
    })

    if (!stock) {
        await new Stock({
            product: productID,
            warehouse: destID,
            stock: deliverOrder.quantity
        }).save()
        warehouse.totalProducts += 1
    }
    else {
        stock.stock += deliverOrder.quantity
        await stock.save()
    }
    warehouse.totalStock += deliverOrder.quantity
    await warehouse.save()
    console.log(stock)
}

const moveWarehouseToWarehouse = async (sourceID, destID, productID, quantity) => {

    //get both warehouses
    const sourceWarehouse = await Warehouse.findOne({
        _id: sourceID
    })

    const destWarehouse = await Warehouse.findOne({
        _id: destID
    })

    //get src stock
    const srcStock = await Stock.findOne({
        product: productID,
        warehouse: sourceID
    })


    //check if product available or stock is enough
    if (!srcStock || srcStock.stock < quantity)
        return errors.NOT_ENOUGH_STOCK



    //get dst stock
    const dstStock = await Stock.findOne({
        product: productID,
        warehouse: destID
    })

    //if dst stock is not available update dst warehouse
    if (!dstStock) {
        await new Stock({
            product: productID,
            warehouse: destID,
            stock: quantity
        }).save()
        destWarehouse.totalProducts += 1
    }
    //if available update stock at both ends
    else {
        dstStock.stock += quantity
        srcStock.stock -= quantity
        await dstStock.save()
        await srcStock.save()
    }
    //update stock count in both warehouses
    destWarehouse.totalStock += quantity
    sourceWarehouse.totalStock -= quantity

    if (srcStock.stock === 0) sourceWarehouse.totalProducts--

    await sourceWarehouse.save()
    await destWarehouse.save()

    return


}

router.post('/move', async (req, res) => {
    try {

        const {
            type,
            sourceID,
            destID,
            productID,
            quantity
        } = req.body

        let result = true

        if (type === 'delivery') moveDeliveryToWarehouse(sourceID, destID, productID)
        if (type === 'warehouse') {
            if (await moveWarehouseToWarehouse(sourceID, destID, productID, quantity) === errors.NOT_ENOUGH_STOCK) {
                result = false
            }
        }
        return result ? res.end() : res.status(400).json({
            error: errors.NOT_ENOUGH_STOCK
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }

})
router.get('/cb', async (req, res) => {
    try {
        const brands = await Brand.find()
        const colours = await ProductColour.find()
        return res.json({
            brands,
            colours
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
        const brands = await Brand.find()
        const colours = await ProductColour.find()
        const warehouses = await Warehouse.find()
        const maxPrice = (await Product.find().sort({ price: -1 }).limit(1))[0].price
        const maxStock = (await Product.find().sort({ totalStock: -1 }).limit(1))[0].totalStock
        const filters = {
            brands,
            colours,
            warehouses,
            maxPrice,
            maxStock
        }


        return res.status(200).json({
            filters
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }

})

router.get('/stock/:pid/:wid', async (req, res) => {

    try {

        const productID = req.params.pid
        const warehouseID = req.params.wid

        const warehouseStock = await Stock.findOne({
            product: productID,
            warehouse: warehouseID
        })


        return res.status(200).json({
            stock: warehouseStock
        })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }

})

router.get('/stock/:id', async (req, res) => {

    try {

        const productID = req.params.id

        const warehouseStock = await Stock.find({
            product: productID,
            stock: { $gt: 0 }
        }).populate(`warehouse`)

        const deliverOrderStocks = await DeliveryOrder.find({
            product: productID,
            quantity: { $gt: 0 },
            status: false,
        })


        const stocks = {
            warehouseStock,
            deliverOrderStocks
        }

        stocks.warehouseStock.map(q => {
            console.log(q._id)
        })


        return res.status(200).json({
            stocks
        })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }

})

router.get('/stocks', async (req, res) => {
    try {
        const stocks = await Stock.find()
            .populate('product', 'serial title')
            .populate('warehouse', 'name')
        return res.json({
            stocks
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

router.get('/stock/:page/:query/:products/:warehouses/:stock/:sort/:sortBy', async (req, res) => {

    try {

        const page = parseInt(req.params.page) - 1
        const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")
        const sort = req.params.sort === '*' ? 'stock' : req.params.sort
        const sortBy = req.params.sortBy === '*' ? 'desc' : req.params.sortBy
        const warehouses = req.params.warehouses
        const products = req.params.products
        const stock = req.params.stock === '*' ? '*' : parseInt(req.params.stock)

        const sortOptions = {
            [sort]: sortBy
        }

        const productIDs = await Product.find({
            title: {
                $in: query.map(q => new RegExp(q, "i"))
            }
        }).select('_id')

        const warehouseIDs = await Warehouse.find({
            name: {
                $in: query.map(q => new RegExp(q, "i"))
            }
        }).select('_id')

        filters = {}
        if (products !== '*') filters['product'] = {
            $in: products.split(',').slice(1, products.length)
        }
        if (warehouses !== '*') filters['warehouse'] = {
            $in: warehouses.split(',').slice(1, warehouses.length)
        }
        if (stock !== '*') filters['stock'] = stock

        filters['$or'] = [
            {
                product: {
                    $in: productIDs.map(c => c._id)
                }
            },
            {
                warehouse: {
                    $in: warehouseIDs.map(b => b._id)
                }
            }
        ]

        const itemsPerPage = config.get('rows-per-page')

        const stocks = await Stock
            .find(filters)
            .populate(['product', 'warehouse'])
            .sort(sortOptions)
        // .skip(itemsPerPage * page)
        // .limit(itemsPerPage)

        return res.status(200).json({
            stocks
        })


    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
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
        console.log(err)

        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

router.get('/:page/:query/:colour/:brand/:warehouse/:date/:quantity/:price/:sort/:sortBy', async (req, res) => {

    console.log(req.url)
    try {

        const page = parseInt(req.params.page) - 1
        const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")
        const colour = req.params.colour
        const brand = req.params.brand
        const warehouse = req.params.warehouse
        const sort = req.params.sort === '*' ? 'date' : req.params.sort
        const sortBy = req.params.sortBy === '*' ? 'desc' : req.params.sortBy
        let date = req.params.date
        const price = parseInt(req.params.price)
        const quantity = req.params.quantity === '*' ? '*' : parseInt(req.params.quantity)
        const sortOptions = {
            'date': 'asc'
        }


        const filters = {}

        if (brand !== '*') filters['brand'] = {
            $in: brand.split(',').slice(1, brand.length)
        }
        if (colour !== '*') filters['colour'] = {
            $in: colour.split(',').slice(1, colour.length)
        }
        if (warehouse !== '*') filters['warehouse'] = {
            $in: warehouse.split(',').slice(1, warehouse.length)
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

        if (price !== 0) filters['price'] = price
        if (quantity !== '*') filters['totalStock'] = quantity

        console.log(filters)
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
            .populate(['brand', 'colour'])
            .sort(sortOptions)
        //    .skip(itemsPerPage * page)
        // .limit(itemsPerPage)

        return res.status(200).json({
            products
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
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
                error: errors.PRODUCT_NOT_EXISTENT
            })
        }

        await Product.deleteOne({
            _id: id
        })

        res.status(200).end()
    } catch (err) {
        console.log(err)

        return res.status(500).json({
            error: errors.SERVER_ERROR
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
        const id = req.params.id
        const product = await Product.findOne({
            _id: id
        })

        if (product.serial !== serial) {
            const exists = await Product.exists({
                serial
            })

            if (exists) {
                return res.status(400).json({
                    error: error.PRODUCT_ALREADY_EXIST
                })
            }
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
        product.description = description
        product.price = price


        await product.save()

        return res.status(200).json({
            product
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

router.post('/colour', async (req, res) => {
    try {

        const colour = req.body.colour.toLowerCase()

        const exists = await ProductColour.findOne({
            title: colour
        })

        if (!exists) {
            const productColour = new ProductColour({
                title: colour
            })

            await productColour.save()
        }
        res.end()
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})
router.post('/brand', async (req, res) => {
    try {

        const brand = req.body.brand.toLowerCase()
        const exists = await Brand.findOne({
            title: brand
        })
        if (!exists) {
            const brandC = new Brand({
                title: brand
            })
            await brandC.save()
        }
        res.end()
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

router.get('/', async (req, res) => {

    try {


        const products = await Product.find({}, { title: 1 })
        return res.status(200).json({
            products
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

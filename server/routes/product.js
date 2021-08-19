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

        const filters = {
            brands,
            colours,
            warehouses
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

router.get('/stock/:id', async (req, res) => {

    try {

        const productID = req.params.id

        const warehouseStock = await Stock.find({
            product: productID
        })

        const deliverOrderStocks = await DeliveryOrder.find({
            product: productID
        })

        const stocks = {
            warehouseStock,
            deliverOrderStocks
        }

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
            .populate(['brand', 'colour'])
            .sort(sortOptions)
            .skip(itemsPerPage * page)
            .limit(itemsPerPage)

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

        const { colour } = req.body

        const productColour = new ProductColour({
            title: colour
        })

        await productColour.save()
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

        const { brand } = req.body

        const brandC = new Brand({
            title: brand
        })

        await brandC.save()
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})



module.exports = router
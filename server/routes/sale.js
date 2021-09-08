const express = require('express')
const router = express.Router()
const Sale = require('../models/Sale')
const config = require('config')
const errors = require('../misc/errors')
const Client = require('../models/Client')
const Product = require('../models/Product')
const Stock = require('../models/Stock')
const Warehouse = require('../models/Warehouse')


router.get('/form-inputs', async (req, res) => {
    //clients and product names
    try {
        const clients = await Client.find().select('userName')
        const products = await Product.find().select('title')


        return res.status(200).json({
            clients,
            products
        })


    } catch (err) {
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

// make a sale

router.post('/', async (req, res) => {
    try {
        var {
            products,
            productID,
            quantity,
            totalWithOutDiscount,
            clientID,
            payment,
            discount,
            total,
            note,
            date,
            deliveryStatus,
            deliveryOrderID,
            received,
            warehouses,
            isWarehouse
        } = req.body

        //update client balance
        var neg = parseInt(total) - parseInt(received)
        const clientPrev = await Client.findById(clientID)

        if (payment === 'Partial') {
            let prev = clientPrev.balance
            let newBal = prev - neg
            clientPrev.balance = newBal
            await clientPrev.save()
        }
        else if (payment === 'Credit') {
            let prev = clientPrev.balance
            let newBal = prev - total
            clientPrev.balance = newBal
            await clientPrev.save()
        }

        for (const product of products) {
            if (product.typeOfSale === 'DeliveryOrder') {
                //cater deliver order
            }
            else {
                for (const warehouse of product.warehouses) {
                    //cater for a specific warehouse
                }
            }
        }



        typeOfSale = 'DeliveryOrder'

        if (isWarehouse === true) {
            typeOfSale = 'Warehouse'
        }




        if (isWarehouse === true) {



            warehouses.ids.map(async (id, i) => {

                if (warehouses['ticks'][id] === true) {

                    const stock = await Stock.find({ product: productID, warehouse: id })
                    console.log(stock)

                    stock.map(async (stock) => {


                        prevStock = stock.stock

                        if (warehouses['quant'][id] < prevStock) {

                            console.log('inside')

                            newStock = prevStock - warehouses['quant'][id]

                            await Stock.findOneAndUpdate({ _id: stock._id }, { stock: newStock })

                            const ware = await Warehouse.findById(id)

                            let prevWarehouse = ware.totalStock
                            let newWareStock = prevWarehouse - warehouses['quant'][id]

                            await Warehouse.findOneAndUpdate({ _id: id }, { totalStock: newWareStock })

                            const prod = await Product.findById(productID)

                            let prev = prod.totalStock
                            let newProdStock = prev - warehouses['quant'][id]

                            Product.findOneAndUpdate({ _id: productID }, { totalStock: newProdStock })


                        }

                    })
                    // console.log('inside')
                    // Stock.find({ product: productID, warehouse: id }).then(res => {
                    //     res.map((stock) => {

                    //         prevStock = stock.stock
                    //         if (warehouses['quant'][id] < prevStock) {
                    //             newStock = prevStock - warehouses['quant'][id]

                    //             Stock.findOneAndUpdate({ _id: stock._id }, { stock: newStock }).then(res => {

                    //                 Warehouse.findById(id).then(res => {
                    //                     let prevWarehouse = res.totalStock
                    //                     let newWareStock = prevWarehouse - warehouses['quant'][id]

                    //                     Warehouse.findOneAndUpdate({ _id: id }, { totalStock: newWareStock }).then(res => {
                    //                         Product.findById(productID).then(res => {
                    //                             let prev = res.totalStock
                    //                             let newProdStock = prev - warehouses['quant'][id]

                    //                             Product.findOneAndUpdate({ _id: productID }, { totalStock: newProdStock }).then(res => {
                    //                                 console.log('success')
                    //                             })
                    //                         })

                    //                     })



                    //                 })
                    //             })
                    //         }
                    //     })

                    // })
                }



            })

        }



        const sale = new Sale({
            product: productID,
            quantity,
            totalWithOutDiscount,
            client: clientID,
            payment,
            discount,
            total,
            note,
            date,
            received,
            deliveryStatus,
            typeOfSale,
            deliveryOrder: deliveryOrderID

        })





        await sale.save()

        return res.status(200).json({
            sale
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
        const maxTotal = (await Sale.find().sort({ total: -1 }).limit(1))[0].total
        const maxQuantity = (await Sale.find().sort({ quantity: -1 }).limit(1))[0].quantity

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
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})



// filter sales
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
    const sales = await Sale
        .find(filters)
        .populate(['product', 'client'])
        .sort(sortOptions)
    // .skip(itemsPerPage * page)
    // .limit(itemsPerPage)


    return res.json({
        sales
    })

})





// view all sales
router.get('/', async (req, res) => {
    try {

        const sale = await Sale.find({}).populate(['product', 'client'])

        return res.status(200).json({
            sale
        })
    }
    catch (err) {
        console.log(err)

        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

// view a specific sale


// router.get('/:id', async (req, res) => {
//     try {


//         const id = req.params.id

//         const sale = await Sale.findById(id)

//         return res.status(200).json({
//             sale
//         })
//     }
//     catch (err) {
//         console.log(err)

//         return res.status(500).json({
//             error: errors.SERVER_ERROR
//         })
//     }
// })


// update deliveryStatus

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id

        let sale = await Sale.findOneAndUpdate({ _id: id }, { deliveryStatus: true }, {
            new: true
        })

        await sale.save()

        return res.status(200).json({
            sale
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
        const sales = await Sale.find({ client: id }).populate(['product', 'client'])
        return res.status(200).json({
            sales
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

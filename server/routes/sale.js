const express = require('express')
const router = express.Router()
const Sale = require('../models/Sale')
const config = require('config')
const Client = require('../models/Client')
const Stock  = require('../models/Stock')
const Warehouse = require('../models/Warehouse')
const Product = require('../models/Product')



// make a sale
router.post('/', async (req, res) => {
    try {
        var {
            productID,
            quantity,
            totalWithOutDiscount,
            clientID,
            payment,
            discount,
            total,
            amountReceived,
            warehouseID,
            note,
            date,
            deliveryStatus
        } = req.body

        console.log(req.body)

        var neg = total - amountReceived 
    
        if(payment === 'Partial')
        {

            const clientPrev = await Client.findById(clientID)
            let prev = clientPrev.balance
            
            let newBal = prev - neg

        let client = await Client.findOneAndUpdate({_id : clientID},{balance : newBal})

        }
        else if(payment === 'Partial')
        {
            const clientPrev = await Client.findById(clientID)
            let prev = clientPrev.balance
            
            let newBal = prev - total

        let client = await Client.findOneAndUpdate({_id : clientID},{balance : newBal})
            

        }


        
        const stock = await Stock.find({product: productID, warehouse : warehouseID})
        prevStock = stock.stock
        if(quantity < prevStock)
        {
            newStock = prevStock - quantity

            let newStock = await Stock.findOneAndUpdate({_id : stock._id}, {stock: newStock})


            const warehousePrev = await Warehouse.findById(warehouseID)
            console.log('logging product Stock of warehouse', warehousePrev.totalStock)
            let prevWarehouse = warehousePrev.totalStock
            let newWareStock = prevWarehouse - quantity
            let warehouse = await Warehouse.findOneAndUpdate({_id : warehouseID},{totalStock : newWareStock})

            const productPrev = await Product.findById(productID)
            let prev = productPrev.totalStock
            let newProdStock = prev - quantity
            let product = await Product.findOneAndUpdate({_id: productID},{totalStock: newProdStock})



            console.log(req.body)


            const sale =  new Sale({
                product:productID,
                quantity,
                totalWithOutDiscount,
                client: clientID,
                payment,
                discount,
                total,
                note,
                date,
                deliveryStatus
            })

            await sale.save()

            return res.status(200).json({
                sale
            })

        }

        else{
            console.log(err)
        return res.status(500).json({
            error: 'SERVER_ERROR'
        })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'SERVER_ERROR'
        })
    }
})


// filter sales


router.get('/:page/:query/:client/:deliveryStatus/:quantity/:total/:sort/:sortBy', async (req, res) => {

    const page = req.params.page - 1
    const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")
    const client = req.params.client
    const deliveryStatus = req.params.deliveryStatus
    const quantity = req.params.quantity
    const total = req.params.total
    const sort = req.params.sort === '*' ? 'date' : req.params.sort
    const sortBy = req.params.sortBy === '*' ? 'desc' : req.params.sortBy

    const sortOptions = {
        [sort]: sortBy
    }


    const filters = {}

    if (client !== '*') filters['client'] = client
    if (deliveryStatus !== '*') filters['deliveryStatus'] = deliveryStatus
    if (quantity !== '*') filters['quantity'] = quantity
    if (total !== '*') filters['total'] = total   


    const productIDs = await Product.find({
        title: {
            $in: query.map(q => new RegExp(q, "i"))
        }
    }).select('_id')


    const clientIDs = await Client.find({
        title: {
            $in: query.map(q => new RegExp(q, "i"))
        }
    }).select('_id')



    filters['$or'] = [
        
        {
            product: {
                $in: productIDs.map(c => c._id)
            }
        },
        {
            client: {
                $in: clientIDs.map(b => b._id)
            }
        }
    ]

    const itemsPerPage = config.get('rows-per-page')

    const sales = await Sale
        .find(filters).populate(['product','client'])
        .sort(sortOptions).populate(['product','client'])
        .skip(itemsPerPage * page).populate(['product','client'])
        .limit(itemsPerPage).populate(['product','client'])

    return res.status(200).json({
        sales
    })

})


/
// view a specific sale


router.get('/:id', async (req, res) => {
    try {


        const id = req.params.id

        const sale = await Sale.findById(id)

        return res.status(200).json({
            sale
        })
    }
    catch (err) {
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})


// update deliveryStatus

router.put('/:id', async (req,res) => {
    try{
        const id = req.params.id

        let  sale =  await Sale.findOneAndUpdate({ _id: id },{deliveryStatus : true} , {
            new : true
        } )

        await sale.save()

        return res.status(200).json({
            sale
        })
    
    }
    catch(err){
        return res.status(400).json({
            error:"SERVER_ERROR"
        })
    }
})

module.exports = router
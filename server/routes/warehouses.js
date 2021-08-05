const express = require('express')
const router = express.Router()
const ProductColour = require('../models/ProductColour')
const Brand = require('../models/Brand')
const Product = require('../models/Product')
const Warehouse = require('../models/Warehouse')
const config = require('config')

router.get('/:id', async (req, res) => {
    try {


        const id = req.params.id

        const warehouse = await Warehouse.findById(id)
        if (warehouse) {
        return res.status(200).json({
            warehouse
        })}
        else {
            return res.status(400).json({
                error: 'SERVER_ERROR'
            })
        }
    }
    catch (err) {
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})

router.post('/', async (req, res) => {
    try {
        var {
            name,
            totalProducts,
            totalStock,
        } = req.body
        
        let checkWarehouse = Warehouse.findOne(
            {
                name : name
            }
        )

        if(checkWarehouse){
            return res.status(400).json({
                error: 'WAREHOUSE_ALREADY_EXIST'
            })
        }

        const warehouse = new Warehouse({
            name,
            totalProducts,
            totalStock,
        })

        await warehouse.save()

        return res.status(200).json({
            warehouse
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
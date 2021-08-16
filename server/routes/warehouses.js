const express = require('express')
const router = express.Router()
const Warehouse = require('../models/Warehouse')
const config = require('config')

router.get('/:id', async (req, res) => {
    try {


        const id = req.params.id

        const warehouse = await Warehouse.findById(id)
        if (warehouse) {
            return res.status(200).json({
                warehouse
            })
        }
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

        } = req.body

        let checkWarehouse = await Warehouse.exists({
            name
        })
        console.log(checkWarehouse)
        if (checkWarehouse) {
            return res.status(400).json({
                error: 'WAREHOUSE_ALREADY_EXIST'
            })
        }
        const warehouse = new Warehouse({
            name

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

router.delete('/:id', async (req, res) => {
    try {

        const id = req.params.id

        const exists = await Warehouse.exists({
            _id: id
        })

        if (!exists) {
            return res.status(400).json({
                error: 'WAREHOUSE_DOES_NOT_EXIST'
            })
        }

        await Warehouse.deleteOne({
            _id: id
        })

        return res.status(200).json({
            status: 'SUCCESSFULY_DELETED'
        })
    } catch (err) {
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }

})

router.put('/:id', async (req, res) => {
    try {
        var {
            name,
            totalProducts,
            totalStock,
        } = req.body

        const id = req.params.id


        let warehouse = await Warehouse.findOne({
            _id: id
        })
        console.log(warehouse)
        if (!warehouse) {
            return res.status(400).json({
                error: 'WAREHOUSE_DOES_NOT_EXIST'
            })
        }
        // const warehouse = new Warehouse({
        //     name,
        //     totalProducts,
        //     totalStock,
        // })

        // await warehouse.save()
        warehouse.name = name
        warehouse.totalProducts = totalProducts
        warehouse.totalStock = totalStock

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
const express = require('express')
const router = express.Router()
const Warehouse = require('../models/Warehouse')
const config = require('config')
const errors = require('../misc/errors')
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
                error: errors.WAREHOUSE_NON_EXISTENT
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERRORs
        })
    }
})

router.post('/', async (req, res) => {
    try {
        var {
            name,
            totalProducts,
            totalStock

        } = req.body

        let checkWarehouse = await Warehouse.exists({
            name
        })
        console.log(checkWarehouse)
        if (checkWarehouse) {
            return res.status(400).json({
                error: errors.WAREHOUSE_ALREADY_EXIST
            })
        }
        const warehouse = new Warehouse({
            name,
            totalProducts,
            totalStock

        })

        await warehouse.save()

        return res.status(200).json({
            warehouse
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR
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
                error: errors.WAREHOUSE_NON_EXISTENT
            })
        }

        await Warehouse.deleteOne({
            _id: id
        })

        return res.status(200).json({
            status: errors.SUCCESSFULY_DELETED
        })
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
                error: errors.WAREHOUSE_DOES_NOT_EXIST
            })
        }

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
        return res.status(500).json({
            error: errors.SERVER_ERROR
        })
    }
})

router.get('/:page/:query/:sort/:sortBy', async (req, res) => {
    try {

        const page = req.params.page - 1
        const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")
        const sort = req.params.sort === '*' ? 'date' : req.params.sort
        const sortBy = req.params.sortBy === '*' ? 'desc' : req.params.sortBy

        const sortOptions = {
            [sort]: sortBy
        }
        console.log(query)
        const filters = {}
        filters['$or'] = [
            {
                name: {
                    $in: query.map(q => new RegExp(q, "i"))
                }
            }]


        const itemsPerPage = config.get('rows-per-page')

        const warehouse = await Warehouse
            .find(filters)
            .sort(sortOptions)
        // .skip(itemsPerPage * page)
        // .limit(itemsPerPage)

        return res.status(200).json({
            warehouse
        })


    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: errors.SERVER_ERROR_SEARCH
        })
    }

})


module.exports = router
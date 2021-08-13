const express = require('express')
const router = express.Router()
const Client = require('../models/Client')
const config = require('config')

// view suppliers
router.get('/', async (req, res) => {
    try {

        const client = await Client.find({})

        return res.status(200).json({
            client
        })
    }
    catch (err) {
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})


// view specific supplieer with id
router.get('/:id', async (req, res) => {
    try {


        const id = req.params.id

        const client = await Client.findById(id)

        return res.status(200).json({
            client
        })
    }
    catch (err) {
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})


// add supplier


router.post('/', async (req, res) => {
    try {
        var {
            userName,
            balance,
            phone,
            date
        } = req.body

        const exists = await Client.exists({
            userName
        })

        if (exists) {
            return res.status(400).json({
                error: 'SUPPLIER_ALREADY_EXIST'
            })
        }


        const client = new Client({
            userName,
            balance,
            phone,
            date
        })

        await client.save()

        return res.status(200).json({
            client
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})




// filter suppliers
router.get('/:page/:query/:userName/:date/:sort/:sortBy', async (req, res) => {

    const page = req.params.page - 1
    const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")
    
    const date = req.params.date
    const userName = req.params.userName
    const sort = req.params.sort === '*' ? 'date' : req.params.sort
    const sortBy = req.params.sortBy === '*' ? 'desc' : req.params.sortBy

    const sortOptions = {
        [sort]: sortBy
    }


    const filters = {}

    if (userName !== '*') filters['userName'] = userName
    if (date !== '*') filters['date'] = date


  

    const itemsPerPage = config.get('rows-per-page')

    const suppliers = await Client
        .sort(sortOptions)
        .skip(itemsPerPage * page)
        .limit(itemsPerPage)

    return res.status(200).json({
        suppliers
    })

})




module.exports = router
const express = require('express')
const router = express.Router()
const Client = require('../models/Client')
const config = require('config')
const { SERVER_ERROR, CLIENT_DOES_NOT_EXIST, DOES_NOT_EXIST, SAME_PHONENUMBER_ALREADY_EXISTS, SAME_USERNAME_ALREADY_EXISTS } = require('../misc/errors')
const Purchase = require('../models/Purchase')
const Sale = require('../models/Sale')
const Payment = require('../models/Payment')

router.get('/ledger/:id', async (req, res) => {
    try {
        const clientId = req.params.id

        const purchases = await Purchase.find({
            client: clientId
        }).populate('product')
        // const sales = await Sale.find({
        //     client: clientId
        // }).populate('product')
        const sales = await Sale
        .find({
            client: clientId
        })
        .populate(['products.product', 'client'])
        const payments = await Payment.find({
            client: clientId
        })

        const ledger = [
            ...purchases.map(p => ({ ...JSON.parse(JSON.stringify(p)), type: "Purchase" })),
            ...sales.map(s => ({ ...JSON.parse(JSON.stringify(s)), type: "Sale" })),
            ...payments.map(p => ({ ...JSON.parse(JSON.stringify(p)), transaction: "Payment" }))
        ]

        ledger.sort((a, b) => new Date(a.date) - new Date(b.date))

        return res.json({
            ledger
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})

router.post('/', async (req, res) => {
    try {
        var {
            userName,
            phone,
        } = req.body

        let checkClientName = await Client.exists({
            userName
        })
        if (checkClientName) {
            return res.status(400).json({
                error: SAME_USERNAME_ALREADY_EXISTS
            })
        }

        let checkClientPhone = await Client.exists({
            phone
        })
        if (checkClientPhone) {
            return res.status(400).json({
                error: SAME_PHONENUMBER_ALREADY_EXISTS
            })
        }

        const client = new Client({
            userName,
            phone,
        })

        await client.save()

        return res.status(200).json({
            client
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})
router.get('/:query', async (req, res) => {
    try {
        const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")
        const clients = await Client.find({
            userName: {
                $in: query.map(q => new RegExp(q, "i"))
            }
        })
        return res.json({
            clients
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})


router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const client = await Client.findById(id)
        if (client) {
            return res.status(200).json({
                client
            })
        }
        else {
            return res.status(400).json({
                error: DOES_NOT_EXIST
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        var {
            userName,
            balance,
            phone,
        } = req.body
        console.log(userName, balance, phone)
        const id = req.params.id


        let client = await Client.findOne({
            _id: id
        })
        console.log(client)
        if (!client) {
            return res.status(400).json({
                error: CLIENT_DOES_NOT_EXIST
            })
        }

        client.userName = userName
        client.balance = balance
        client.phone = phone

        await client.save()
        console.log(client)
        return res.status(200).json({
            client
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
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
        const filters = {}
        filters['$or'] = [
            {
                userName: {
                    $in: query.map(q => new RegExp(q, "i"))
                }
            }]
        const itemsPerPage = config.get('rows-per-page')
        const warehouse = await Client
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
            error: SERVER_ERROR_SEARCH
        })
    }
})

module.exports = router


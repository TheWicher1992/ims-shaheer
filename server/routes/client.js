const express = require('express')
const router = express.Router()
const Client = require('../models/Client')
const config = require('config')

router.post('/', async (req, res) => {
    try {
        var {
            userName,
            // balance,
            phone,
        } = req.body

        let checkClientName = await Client.exists({
            userName
        })
        if (checkClientName) {
            return res.status(400).json({
                error: 'SAME_USERNAME_ALREADY_EXISTS'
            })
        }

        let checkClientPhone = await Client.exists({
            phone
        })
        if (checkClientPhone) {
            return res.status(400).json({
                error: 'SAME_PHONENUMBER_ALREADY_EXISTS'
            })
        }

        const client = new Client({
            userName,
            // balance,
            phone,
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
router.get('/:query', async (req, res) => {
    const query = req.params.query === '*' ? ['.*'] : req.params.query.split(" ")

    const clients = await Client.find({
        userName: {
            $in: query.map(q => new RegExp(q, "i"))
        }
    })




    return res.json({
        clients
    })



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
                error: 'CLIENT_DOES_NOT_EXIST'
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
        return res.status(400).json({
            error: 'SERVER_ERROR'
        })
    }
})




module.exports = router
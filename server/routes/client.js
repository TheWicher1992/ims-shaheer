const express = require('express')
const router = express.Router()
const Client = require('../models/Client')
const config = require('config')

router.post('/', async (req, res) => {
    try {
        var {
            userName,
            balance,
            phone,
        } = req.body
        
        let checkClientName = await Client.exists({
            userName
        })
        if(checkClientName){
            return res.status(400).json({
                error: 'SAME_USERNAME_ALREADY_EXISTS'
            })
        }

        let checkClientPhone = await Client.exists({
            phone
        })
        if(checkClientPhone){
            return res.status(400).json({
                error: 'SAME_PHONENUMBER_ALREADY_EXISTS'
            })
        }

        const client = new Client({
            userName,
            balance,
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

    router.get('/:id', async (req, res) => {
        try {
    
    
            const id = req.params.id
    
            const client = await Client.findById(id)
            if (client) {
            return res.status(200).json({
                client
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

    module.exports = router
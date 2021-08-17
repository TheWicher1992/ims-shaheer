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

    router.put('/:id', async (req, res) => {
        try {
            var {
                userName,
                balance,
                phone,
            } = req.body
            console.log(userName, balance,phone)
            const id = req.params.id
    
    
            let client = await Client.findOne({
                _id : id
            })
            console.log(client)
            if(!client){
                return res.status(400).json({
                    error: 'CLIENT_DOES_NOT_EXIST'
                })
            }

            client.userName= userName
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
                    userName: {
                        $in: query.map(q => new RegExp(q, "i"))
                    }
                }]
        
        
                const itemsPerPage = config.get('rows-per-page')
        
                const warehouse = await Client
                .find(filters)
                .sort(sortOptions)
                .skip(itemsPerPage * page)
                .limit(itemsPerPage)
        
                return res.status(200).json({
                    warehouse})
        
        
            }
            catch (err) {
                console.log(err)
                return res.status(400).json({
                    error: 'SERVER_ERROR_SEARCH'
                })
            }
        
        })

    module.exports = router
const express = require('express')
const Admin = require('../models/Admin')
const router = express.Router()
const bcrypt = require('bcryptjs')
const Employee = require('../models/Employee')
const jwt = require('jsonwebtoken')
const config = require('config')
const { auth, adminAuth, employeeAuth } = require('../middlewares/auth')
const { USER_ALREADY_EXIST, SERVER_ERROR, DOES_NOT_EXIST, INVALID_CREDITS, SUCCESSFULY_DELETED } = require('../misc/errors')

router.post('/add-admin', adminAuth, async (req, res) => {
    try {
        const {
            userName,
            password
        } = req.body

        const exists = await Admin.exists({
            userName
        })

        if (exists) {
            return res.status(400).json({
                error: USER_ALREADY_EXIST
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const admin = new Admin({
            userName,
            password: hashedPassword
        })

        await admin.save()

        const payload = {
            type: 'admin',
            id: admin._id
        }


        const token = await jwt.sign(payload, config.get('token-secret'), { expiresIn: 360000 })

        return res.status(200).json({
            token
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }

})

router.post('/add-employee', /*adminAuth,*/ async (req, res) => {
    try {
        const {
            userName,
            password
        } = req.body
        const exists = await Employee.exists({
            userName
        })

        if (exists) {
            return res.status(400).json({
                error: USER_ALREADY_EXIST
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const employee = new Employee({
            userName,
            password: hashedPassword
        })

        await employee.save()

        const payload = {
            type: 'employee',
            id: employee._id
        }


        const token = await jwt.sign(payload, config.get('token-secret'), { expiresIn: 360000 })

        return res.status(200).json({
            token
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }


})

router.get("/", auth, async (req, res) => {
    try {
        const User = req.user.type === 'admin' ? Admin : Employee

        let user = JSON.parse(JSON.stringify(await User.findById(req.user.id)))

        user = { ...user, type: req.user.type }

        return res.status(200).json({
            user
        })
    }
    catch (err) {

        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }

})

router.get('/all', async (req, res) => {
    try {
        const admins = await Admin.find()
        const employees = await Employee.find()

        return res.json({
            admins,
            employees
        })
    } catch (err) {

        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const {
            userName,
            password,
            type
        } = req.body

        const userType = {
            'admin': Admin,
            'employee': Employee
        }

        const User = userType[type]

        const exists = await User.exists({
            userName
        })

        if (!exists) {
            return res.status(400).json({
                error: INVALID_CREDITS
            })
        }

        const user = await User.findOne({
            userName
        })

        const passMatch = await bcrypt.compare(password, user.password)

        if (passMatch) {
            const token = await jwt.sign({
                type, id: user._id
            }, config.get('token-secret'), {
                expiresIn: 360000
            })

            return res.status(200).json({
                token
            })
        }
        else {
            return res.status(400).json({
                error: INVALID_CREDITS
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }

})

router.get('/default-admin', async (req, res) => {
    try {

        const userName = 'admin'
        const password = 'admin'

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const admin = new Admin({
            userName,
            password: hashedPassword
        })

        await admin.save()
        return res.end()
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }


})

router.delete('/employee/:id', async (req, res) => {
    try {

        const id = req.params.id

        const existsEmployee = await Employee.exists({
            _id: id
        })

        const existsAdmin = await Admin.exists({
            _id: id
        })

        if (existsEmployee) {

            await Employee.deleteOne({
                _id: id
            })

            return res.status(200).json({
                status: SUCCESSFULY_DELETED
            })
        }
        else if (existsAdmin) {
            await Admin.deleteOne({
                _id: id
            })

            return res.status(200).json({
                status: SUCCESSFULY_DELETED
            })
        }


        return res.status(400).json({
            status: DOES_NOT_EXIST
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: SERVER_ERROR
        })
    }

})

module.exports = router
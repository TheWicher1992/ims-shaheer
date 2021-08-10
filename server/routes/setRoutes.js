const authRouter = require('./auth')
const productRouter = require('./product')
const orderRouter = require('./order')
const saleRouter = require('./sale')
const supplierRouter = require('./supplier')
module.exports = function (app) {
    app.use('/api/auth', authRouter)
    app.use('/api/product', productRouter)
    app.use('/api/order',orderRouter)
    
    app.use('/api/supplier',supplierRouter)
    app.use('/api/sale',saleRouter)
}
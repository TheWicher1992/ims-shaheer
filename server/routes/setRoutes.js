const authRouter = require('./auth')
const productRouter = require('./product')
const warehouseRouter = require('./warehouses')
const clientRouter = require('./client')
module.exports = function (app) {
    app.use('/api/auth', authRouter)
    app.use('/api/product', productRouter)
    app.use('/api/warehouse', warehouseRouter)
    app.use('/api/client', clientRouter)
}
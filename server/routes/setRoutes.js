const authRouter = require('./auth')
const productRouter = require('./product')
const warehouseRouter = require('./warehouses')
module.exports = function (app) {
    app.use('/api/auth', authRouter)
    app.use('/api/product', productRouter)
    app.use('/api/warehouse', warehouseRouter)
}
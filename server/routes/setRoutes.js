const authRouter = require('./auth')
const productRouter = require('./product')
const purchaseRouter = require('./purchase')
module.exports = function (app) {
    app.use('/api/auth', authRouter)
    app.use('/api/product', productRouter)
    app.use('/api/purchase', purchaseRouter)
}
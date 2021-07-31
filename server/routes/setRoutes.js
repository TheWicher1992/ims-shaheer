const authRouter = require('./auth')
const productRouter = require('./product')
module.exports = function (app) {
    app.use('/api/auth', authRouter)
    app.use('/api/product', productRouter)
}
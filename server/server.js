const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const connectDB = require('./db/db')
const setRoutes = require('./routes/setRoutes')
//Cross Origin Policy for interaction between client and server
app.use(cors())

//JSON Request body parser
app.use(express.json())

//Connect to MongoDB Atlas
connectDB()

require('./models/Admin')
require('./models/Client')
require('./models/DeliveryOrder')
require('./models/Employee')
require('./models/Product')
require('./models/Purchase')
require('./models/Sale')
require('./models/Warehouse')
require('./models/Brand')
require('./models/ProductColour')
require('./models/Payment')
//Test Route
app.get('/', (req, res) => res.send("Hello World!"))
setRoutes(app)

//Start the server at PORT 5000 or the one specified in environmental vairable
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})


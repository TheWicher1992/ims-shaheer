const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const connectDB = require('./db/db')

//Cross Origin Policy for interaction between client and server
app.use(cors())

//JSON Request body parser
app.use(express.json())

//Connect to MongoDB Atlas
connectDB()

//Test Route
app.get('/', (req, res) => res.send("Hello World!"))


//Start the server at PORT 5000 or the one specified in environmental vairable
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})


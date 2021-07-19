const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const connectDB = require('./db/db')
app.use(cors())
app.use(express.json())

connectDB()

app.get('/', (req, res) => res.send("Hello World!"))

app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`)
})


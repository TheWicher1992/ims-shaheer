const mongoose = require('mongoose')
const config = require('config')


module.exports = () => {
    const dbUri = config.get('db')
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.error("Error connection to database!", err.message)
        }
        else {
            console.log("Database connected successfuly!")
        }
    })
}
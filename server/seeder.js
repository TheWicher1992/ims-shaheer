const faker = require('faker')
const mongoose = require('mongoose')
const config = require('config');
(() => {
    const dbUri = config.get('local_db')
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.error("Error connection to database!", err.message)
        }
        else {
            console.log("Database connected successfuly!")
        }
    })
})();

const Product = require('./models/Product')

const generateProducts = (async () => {
    const colours = [
        '6127b99124ad841aac480035'
    ]
    const brands = [

        '6127b99e24ad841aac48003d'
    ]

    for (let i = 0; i < 50; i++) {



        let product = {
            title: faker.commerce.product(),
            serial: faker.random.alphaNumeric(10),
            brand: faker.random.arrayElement(brands),
            colour: faker.random.arrayElement(colours),
            price: parseInt(faker.commerce.price()),
            description: faker.commerce.productDescription()
        }
        await new Product(product).save()
    }


    // const product = {
    //     title: '',
    //     serial: '',
    //     brand: '',
    //     colour: '',
    //     price: 0,
    //     description: ''
    // }







})().then(() => console.log('done'))
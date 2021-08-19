const faker = require('faker')
const mongoose = require('mongoose')
const config = require('config');
(() => {
    const dbUri = config.get('db')
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
        '61059b600784cb33745afd49',
        '611a635ebd074b0016f801d7',
        '611a6387bd074b0016f801e0',
        '611a63c8bd074b0016f801e9',
        '611e21bdeecc880016bf3ad5',
        '611e2263eecc880016bf3ae4'
    ]
    const brands = [
        '61059b9e0aba913424e06ec0',
        '611a64d8f8db00001636c2c7',
        '611a6798f8db00001636c324',
        '611e2279eecc880016bf3ae8'
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
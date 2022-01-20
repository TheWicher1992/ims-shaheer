const mongoose = require('mongoose')
const config = require('config');
const { products } = require('./data.json');
const axios = require('axios').default;

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
const ProductColour = require('./models/ProductColour')
const ProductBrand = require('./models/Brand')
const Warehouse = require('./models/Warehouse')
const seedProducts = async () => {
    await Product.deleteMany()
    await ProductColour.deleteMany()
    await ProductBrand.deleteMany()
    await Warehouse.deleteMany()

    const colors = []
    const brands = []
    const warehouses = []
    const warehouseStock = {}
    const warehouseProducts = {}
    for (const product of products) {
        if (!colors.includes(product.Color ? product.Color : "-")) colors.push(product.Color ? product.Color : "-")
        if (!brands.includes(product.Brand ? product.Brand : "-")) brands.push(product.Brand ? product.Brand : "-")
        if (!warehouses.includes(product.Warehouse ? product.Warehouse : "-")) warehouses.push(product.Warehouse ? product.Warehouse : "-")
        if (!warehouseStock[product.Warehouse]) warehouseStock[product.Warehouse] = 0
        if (!warehouseProducts[product.Warehouse]) warehouseProducts[product.Warehouse] = 0
        warehouseStock[product.Warehouse] += product.Stock === "-" ? 0 : parseInt(product.Stock)
        warehouseProducts[product.Warehouse] += 1
    }


    const allColorSaved = colors.map(color => {
        const newColor = new ProductColour({ title: color })
        return newColor.save()
    })
    const allBrandSaved = brands.map(brand => {
        const newBrand = new ProductBrand({ title: brand })
        return newBrand.save()
    })
    const allWarehouseSaved = warehouses.map(warehouse => {
        const newWarehouse = new Warehouse({
            name: warehouse,
            totalProducts: 0,
            totalStock: 0
        })
        return newWarehouse.save()
    })

    await Promise.all(allColorSaved)
    await Promise.all(allBrandSaved)
    await Promise.all(allWarehouseSaved)
    const getWarehouses = await Warehouse.find()
    const getBrands = await ProductBrand.find()
    const getColors = await ProductColour.find()

    const warehouseIdMap = {}
    const colourIdMap = {}
    const brandIdMap = {}
    for (const w of getWarehouses) {
        warehouseIdMap[w.name] = w._id
    }
    for (const c of getColors) {
        colourIdMap[c.title] = c._id
    }
    for (const b of getBrands) {
        brandIdMap[b.title] = b._id
    }

    //posts requests for products
    setTimeout(() => {
        Promise.all(products.map(product => {
            if (colourIdMap[product.Color] === null) console.log("pc---->", product.Color)
            if (brandIdMap[product.Brand] === null) console.log("pb---->", product.Brand)

            const data = {
                title: product.Product,
                serial: product.Grade,
                brandID: brandIdMap[product.Brand ? product.Brand : "-"],
                colourID: colourIdMap[product.Color ? product.Color : "-"],
                description: product.Description,
                isNewColour: false,
                isNewBrand: false,
                price: product.Amount === '-' ? 0 : parseInt(product.Amount),
                warehouse: warehouseIdMap[product.Warehouse],
                stock: product.Stock === '-' ? 0 : parseInt(product.Stock)
            }
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            return axios.post('http://localhost:5000/api/product', data, config)
        })).then(() => console.log('done')).catch(err => console.log(err))

    }, 5000)


}

seedProducts()






// const generateProducts = (async () => {
//     const colours = [
//         '6127b99124ad841aac480035'
//     ]
//     const brands = [

//         '6127b99e24ad841aac48003d'
//     ]

//     for (let i = 0; i < 50; i++) {



//         let product = {
//             title: faker.commerce.product(),
//             serial: faker.random.alphaNumeric(10),
//             brand: faker.random.arrayElement(brands),
//             colour: faker.random.arrayElement(colours),
//             price: parseInt(faker.commerce.price()),
//             description: faker.commerce.productDescription()
//         }
//         await new Product(product).save()
//     }


//     // const product = {
//     //     title: '',
//     //     serial: '',
//     //     brand: '',
//     //     colour: '',
//     //     price: 0,
//     //     description: ''
//     // }







// })().then(() => console.log('done'))

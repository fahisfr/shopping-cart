var db = require('../config/connection')
var collection=require('../config/collections')
module.exports = {

    addProduct: (product, callback) => {
        console.log(product);
        console.log("fin")
        db.get().collection('product').insertOne(product).then((data) => {
            console.log(data)
            callback(data)

        })
    },
    getAllProducts: () => {
        return new Promise(async(resolve, reject) => {
            let products =await db.get().collection(collection.PROUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    
    }

   
     

}
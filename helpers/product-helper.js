var db = require('../config/connection');
var collection=require('../config/collections');
const { PROUCT_COLLECTION } = require('../config/collections');
var objectid =require('mongodb').ObjectId
module.exports = {

    addProduct: (product, callback) => {
        console.log(product);
        console.log("fin")
        db.get().collection('product').insertONE(product).then((data) => {
            console.log(data)
            callback(data)

        })
    },
    getAllProducts: () => {
        return new Promise(async(resolve, reject) => {
            let products =await db.get().collection(collection.PROUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    
    },
    deleteproduct: (proid) => {
        return new Promise((resolve, reject) => {
            db.get().collection('product').remove({name: proid}).then((response) => {
                console.log(response);
                resolve(response)
            })
  
        })
    }

   
     
}   
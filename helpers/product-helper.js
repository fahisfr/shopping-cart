var db = require('../config/connection');
var collection=require('../config/collections');
const { PROUCT_COLLECTION } = require('../config/collections');
var objectid =require('mongodb').ObjectId
module.exports = {

    addProduct: (product, callback) => {
        console.log(product);
        console.log("fin")
        db.get().collection('product').insertOne(product).then((data) => {
         
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
            db.get().collection('product').deleteOne({name: proid}).then((response) => {
                console.log(response);
                resolve(response)
            })
  
        })
    },
  
    getproductdetails: (proid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PROUCT_COLLECTION).findOne({name:proid }).then((product) => {
                resolve(product)
            })
        })
        
    },
    updateproduct: (proid, prodetails) => {
        return new Promise((resolve, reject) => {
            
            db.get().collection(collection.PROUCT_COLLECTION)
                .updateOne({ name: proid }, {
                    $set: {
                    name: prodetails.name,
                    description: prodetails.description,
                    price: prodetails.price,
                    category: prodetails.category,
                    
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
   
     
}   
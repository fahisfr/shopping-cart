var db = require('../config/connection');
var collection=require('../config/collections');

var objectid =require('mongodb').ObjectId;
const { resolve, reject } = require('promise');
const { Collection } = require('mongodb');
module.exports = {
    adminlogin: (admin) => {
        return new Promise(async (resolve, reject) => {
            let response={}

            let adminkey = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ adminid: admin.adminkey })
            if (adminkey) {
                db.get().collection(collection.ADMIN_COLLECTION).findOne({ adminpass: admin.adminpass }).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.admin = admin
                        response.status = true
                        resolve(response)
                        
                    } else {
                        console.log('password is wrong');
                        resolve({status:false})
                    }
                })
                
                
            } else {
                console.log('admin key not valied')
                resolve({status:false})
            }
      })  
    },

    addProduct: (product, callback) => {
        console.log(product);
        product.price = parseInt(product.price)
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
    },
    getAllorder: () => {
        return new Promise((resolve, reject) => {
            let odrers = db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            resolve(odrers)
        })
    }
   
     
}   
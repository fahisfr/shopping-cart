var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
const objectid = require('mongodb').ObjectId
const { response } = require('express')
const { Collection } = require('mongodb')
module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            console.log("fine")
            db.get().collection('user').insertOne(userData).then((data) => {
                console.log(data)
                resolve(data)
            })
        })
    },
    doLogin: (userData) => {
     
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection("user").findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log('login success');
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('password false');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('login failed')
                resolve({ status: false })

            }
        })
    }, addToCart: (proid, userid) => {
        //create iteam and quantity in {}
        proobj = {
            item: objectid(proid),
            quantity:1
        }
        return new Promise(async (resolve, reject) => {
            //checking user cart creat or not
            let usercart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectid(userid) })
            if (usercart) {
                //check prodect in cart 
                proexist = usercart.products.findIndex(product => product.item == proid)
                console.log(proexist)
                //-1 meaning product not cart (array -1 position =null)
                if (proexist != -1) {
                    //update product quantity number . finding producs,item == proid then update 
                    db.get().collection(collection.CART_COLLECTION).updateOne({ 'products.item': objectid(proid) },
                        {// inc =increase quantity 
                            $inc:{'products.$.quantity':1}
                        }
                    ).then(() => {
                        resolve()
                    })
                } else
                    //product not in cart .now add new ptoduct and quantity 1 normal 
                db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectid(userid) },
                    {
                        $push: { products: proobj }
                    }               
                ).then(() => {
                    resolve()
                })
                // else user have no cart create case , create new cart for user 
            } else {
                let cartobj = {
                    user: objectid(userid),
                    products: [proobj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartobj).then((response) => {
                    resolve()
                })
            }
            
        })
    },
    getCartProduct: (userId) => {
        return new Promise(async (resolve, reject) => {
            //(not)aggregate connect all database data
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {//matching cart user id ==userId
                    $match:{user:objectid(userId)}
                },
                //before data one {_id ,user=cart owner userid ,products in one[array] }
                {

                    $unwind: '$products'
                    //unwind split {id ,user,products:{item :productid,quantity}} (your have cart 2 products , split two {})
                },
                {
                    //take product item and quantity 
                    $project: {
                        item: '$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup: {
                        //localField;item (products id), foreignField_ id match products id as products
                        from: collection.PROUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as:'product'
                    }
                }

            ]).toArray()
            console.log(cartItems)
  
            resolve(cartItems)
            
        })
    
    },
    getCartCount: (userId) => {
        return new Promise(async(resolve, reject) => {
            let count= 0
            let cart =await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectid(userId) })
            if (cart) {
                count=cart.products.length
            }
            resolve(count)
        })
    }
        
             
}
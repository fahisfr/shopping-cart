var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
const objectid = require('mongodb').ObjectId
const { response } = require('express')
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
        return new Promise(async (resolve, reject) => {
            let usercart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: objectid(userid) })
            if (usercart) {
                db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectid(userid) },
                    {
                        $push: { products: objectid(proid) }
                    }
                
                ).then((response) => {
                    resolve()
                })
                
            } else {
                let cartobj = {
                    user: objectid(userid),
                    products: [objectid(proid)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartobj).then((response) => {
                    resolve()
                })
            }
            
        })
    },
    getCartProduct: (userId) => {
        return new Promise(async(resolve, reject) => {
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectid(userId)}
                },
                {
                    $lookup: {
                        from: collection.PROUCT_COLLECTION,
                        let: { proList: '$products' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in:['$_id',"$$proList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
            
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
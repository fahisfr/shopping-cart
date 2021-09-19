var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
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
                        
                    }else{
                        console.log('password wrong .');
                        resolve({status:false})
                        
                    }
                })
            } else {
                console.log('login failed')
                resolve({status:false})

            }
        })
    }
}
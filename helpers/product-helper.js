var db= require('../config/connection')
module.exports = {

    addProduct: (product, callback) => {
        console.log(product);
        console.log("fin")
        db.get().collection('product').insertOne(product).then((data) => {
            console.log(data)
            callback(data)

        })
    }
   
     

}
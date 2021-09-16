var express = require('express');
var router = express.Router();
const produthelper = require('../helpers/product-helper')

/* GET home page. */
router.get('/', function (req, res, next) {
  produthelper.getAllProducts().then((products) => {

    res.render('user/views-project', { products,admin:false })
     
   })
  

  
  
});

module.exports = router;

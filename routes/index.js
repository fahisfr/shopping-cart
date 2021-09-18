var express = require('express');
var router = express.Router();
const produthelper = require('../helpers/product-helper')

/* GET home page. */
router.get('/', function (req, res, next) {
  produthelper.getAllProducts().then((products) => {

    res.render('user/views-project', { products,admin:false })
     
   })
});
router.get('/login', (req, res) => {
  res.render("user/login")
})
router.get('/signup', (req, res) => {
  res.render('user/signup')
})

module.exports = router;

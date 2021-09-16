var express = require('express');
var router = express.Router();
const produthelper = require('../helpers/product-helper')

var today = new Date();

/* GET users listing. */
router.get('/', function (req, res, next) {
  
  produthelper.getAllProducts().then((products) => {
    console.log(products);
    res.render('admin/views-products',{admin:true,products})
  })
  
  
});
router.get('/add-product', function (req, res) {
 
  res.render('admin/add-pro')

})
router.post('/add-product', (req, res) => {
  console.log(req.body);
  console.log(req.files.img);

  produthelper.addProduct(req.body, (result) => {
    let image = req.files.img
    //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    image.mv('public/product-images/' + req.body.name +'.jpg', (err, done) => {
      if (!err) {
        res.render("admin/add-pro")
        
      }
    })
    
  })
})
module.exports = router;

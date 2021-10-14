const { response } = require('express');
var express = require('express');
const { USER_COLLECTION } = require('../config/collections');
const { get } = require('../config/connection');
const productHelper = require('../helpers/product-helper');
var router = express.Router();
const produthelper = require('../helpers/product-helper');
const userHelper = require('../helpers/user-helper');

var today = new Date();
const verifyadminlogin = ((req, res, next) => {
  if (req.session.adminlogin) {
    next()
  } else {
    res.redirect('admin/admin-login')
  }

})
/* GET users listing. */
router.get('/',verifyadminlogin, function (req, res, next) {
  
  produthelper.getAllProducts().then((products) => {
    console.log(products);
    res.render('admin/views-products',{admin:true,products})
  })
  
  
});
router.get('/admin-login', (req, res) => {
  if (req.session.adminlogin){
    res.redirect('/admin')
  } else {
    res.render('admin/login',{'adminloginerr':req.session.adminloginerr})
    
  }
  
})
router.post('/admin-login', (req, res) => {
  productHelper.adminlogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminlogin = true
      res.redirect('/admin')
    } else {
      req.session.adminloginerr = "adminkey or adminpass not valied"
      req.adminlogin = false
      res.redirect('admin-login')
      
    }
    
  })
})
router.get('/add-product', function (req, res) {

 
  res.render('admin/add-pro')

})
router.post('/add-product', (req, res) => {
  console.log(req.body);
  console.log(req.files.img);


  produthelper.addProduct(req.body, (result) => {
    let image = req.files.img
    console.log(result)
    
    //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    image.mv('public/product-images/' + req.body.name +'.jpg', (err, done) => {
      if (!err) {
        res.render("admin/add-pro")
        
      }
    })
    
  })
})
router.get('/delete-product/:id', (req, res) => {

  let proid = req.params.id
  console.log(proid);
  produthelper.deleteproduct(proid).then(response)
  console.log( response+"deleted")
  res.redirect('/admin/')
  
})
router.get('/edit-product/:id', async(req, res) => {
  let product = await produthelper.getproductdetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product', { product })
 
})
router.post('/edit-product/:id', (req, res) => {
  produthelper.updateproduct(req.params.id, req.body).then(() => {
    res.redirect('/admin')
    if (req.files.img) {
      let image = req.files.img
      image.mv('public/product-images/' + req.params.id+'.jpg')
      
    }

  })
})
router.get('/allorders/', (req, res) => {
  productHelper.getAllorder().then((orders) => {
    res.render('admin/orders',{orders})
  })
})
router.get('/allorders/shipped/:id', (req, res) => {
  console.log(req.params.id);
  productHelper.productShipped(req.params.id).then(response)
  res.redirect('/admin/allorders')
  
})
router.get('/view-order-delivered/:id',async (req, res) => {
  let order =await productHelper.getUserOrder(req.params.id)
  productHelper.deliered(req.params.id, order)
  res.redirect('/admin/allorders')
  
})
router.get('/users', (req, res) => {
  productHelper.getUserDetails().then((users) => {
    console.log(users)
    res.render('admin/users',{users})
  })
})
router.get('/users/delete-user/:id', (req, res) => {
  console.log(req.params.id)
  productHelper.deleteUser(req.params.id).then((response) => {
    res.redirect('/admin/users')
  })
  
})
module.exports = router;

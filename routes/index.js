const { response } = require('express');
var express = require('express');
const session = require('express-session');
var router = express.Router();
const produthelper = require('../helpers/product-helper')
const userHelpers = require('../helpers/user-helper')


const verifylogin = ((req, res, next) => {
   if (req.session.loggedIn) {
     next()
  } else {
    res.redirect('/login')
  }
  
})

router.get('/', function (req, res, next) {
  let user = req.session.user
  
  console.log(user)
  produthelper.getAllProducts().then((products) => {

    res.render('user/views-project', { products,user })
     
   })
});
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect(("/"))
  } else {
    res.render("user/login", { "loginerr": req.session.loginerr })
    req.session.loginerr=false
  }
});

router.get('/signup', (req, res) => {
  res.render('user/signup')
});
router.post('/signup', (req, res) => {
  
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
  })

});
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginerr="email or password wrong"
      res.redirect('/login')
    }
  })
});
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
  
})
router.get('/cart', verifylogin, async(req, res) => {
  products = await userHelpers.getCartProduct(req.session.user._id)
  console.log(products);
  res.render('user/cart',{products,user:req.session.user})
  
})
router.get('/add-to-cart/:id',verifylogin, (req, res) => {
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    
    
    res.redirect('/')
  })
})

module.exports = router;

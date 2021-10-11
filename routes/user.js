const { response } = require('express');
var express = require('express');
const session = require('express-session');
var router = express.Router();
const produthelper = require('../helpers/product-helper')
const userHelpers = require('../helpers/user-helper')


const verifylogin = ((req, res, next) => {
   if (req.session.userloggedIn) {
     next()
  } else {
    res.redirect('/login')
  }
  
})
router.get('/', async function (req, res, next) {
  let user = req.session.user
  
  console.log(user);
  let cartcount = null
  if (req.session.user) {
    cartcount = await userHelpers.getCartCount(req.session.user._id)
  }
  produthelper.getAllProducts().then((products) => {

    res.render('user/views-project', { products,user,cartcount})
     
   })
});
router.get('/login', (req, res) => {
  if (req.session.userloggedIn) {
    res.redirect("/")
  } else {
    res.render("user/login", { "loginerr": req.session.userloginerr })
    req.session.userloginerr=false
  }
});

router.get('/signup', (req, res) => {
  res.render('user/signup')
});
router.post('/signup', (req, res) => {
  
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
  res.redirect('/login')
  })

});
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.userloggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.userloginerr="email or password wrong"
      res.redirect('/login')
    }
  })
});
router.get('/logout', (req, res) => {
  req.session.user = null
  req.session.userloggedIn=false
  res.redirect('/')
  
})
router.get('/cart', verifylogin, async(req, res) => {
  products = await userHelpers.getCartProduct(req.session.user._id)
  let totalvalue = 0
  console.log(totalvalue);
  
  if (products.length > 0) {
    totalvalue = await userHelpers.getTotalAmount(req.session.user._id)
    
  }
  console.log(products);
  res.render('user/cart',{products,user:req.session.user._id,totalvalue})
  
})
router.get('/add-to-cart/:id', (req, res) => {
  console.log('call alrt');
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({status:true})
  
    
  })
})
router.post('/chage-product-quantity',(req, res,next) => {
  console.log("pass")
  userHelpers.chageproductcount(req.body).then(async (response) => {
    if (response.removeProduct) {
      response.total=0
    } else {
      response.total = await userHelpers.getTotalAmount(req.body.user)
    }
    console.log(response.total);
    res.json(response)
  })
})
router.post('/remove-cart-product', (req, res) => {
  console.log(req.body)
  userHelpers.removeCartProduct(req.body).then((response) => {
  
    res.json(response)
  })

})
router.post('/clear-user-cart', (req, res) => {
  console.log('test.')
  console.log(req.body);
  userHelpers.ClearCart(req.body).then((response) => {
   
    res.json(response)
  })
  
})
router.get('/place-order',verifylogin,async (req, res) => {
  let total = await userHelpers.getTotalAmount(req.session.user._id)
  res.render('user/place-order',{total,user:req.session.user})
})
router.post('/place-order', async(req, res) => {
  let products = await userHelpers.getCartpructslist(req.body.userId)
  let totalprice= await userHelpers.getTotalAmount(req.body.userId)
  userHelpers.placeOrder(req.body, products, totalprice).then((orderID) => {
    if (req.body.payment_method === 'COD') {
      res.json({codsuccess:true})
    } else {
      userHelpers.generateRazorpay(orderID, totalprice).then((response) => {
        console.log('main status pass')
        res.json(response)
        
      })
    }
    
    
  })
  console.log(req.body);
})
router.get('/order-success', (req, res) => {
  res.render('user/order-success',{user:req.session.user})
  
})
router.get('/order',async (req, res) => {
  let orders = await userHelpers.getUseroOrder(req.session.user._id)
  res.render('user/order',{orders})
})
router.get('/view-order-products/:id', async (req, res) => {
  let products = await userHelpers.getOdrderProducts(req.params.id)
  res.render('user/view-order-products',{user:req.session.user,products})
  
})
router.post('/verify-payment',(req,res)=> {
  console.log(req.body);
  console.log("i am done")
  userHelpers.verifyPayment(req.body).then(() => {
    console.log('pass1');
    userHelpers.chagepaymentstatus(req.body['order[receipt]']).then(() => {
      console.log("success")
      res.json({status:true})
    })
  }).catch((err) => {
    console.log(err)
    res.json({status:false})
  })
})
module.exports = router;

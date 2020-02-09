var express=require('express')
var router=express.Router()
var SESS_NAME=require('../app').SESS_NAME;

var redirectLogin=require('../middlewares/auth').redirectLogin
var redirectHome=require('../middlewares/auth').redirectHome
const authController = require('../controllers/authController')

router.route(['/index','/'])
.get((req,res) => {
    const {userId} = req.session
    // console.log(req.session.userId)
    return res.render('index',{userId:userId})
})

    router.route('/login')
    .get(redirectHome,(req,res) => {
        // res.render('login')
        res.status(401).send('please login first')
    })
    .post(redirectHome,authController.login)
    
    router.route('/register')
    .get(redirectHome,(req,res) => {
        res.render('register')
    })
    .post(redirectHome,authController.register)
    //home
router.route('/home')
 .get(redirectLogin,(req,res)=>{
    
     console.log(req.session.user.name)
return res.render('home',{name:req.session.user.name})

})

router.post('/logout',authController.logout)
module.exports=router;
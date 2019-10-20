var express=require('express')
var router=express.Router()
var SESS_NAME=require('../app').SESS_NAME;

var redirectLogin=require('../middlewares/auth').redirectLogin
var redirectHome=require('../middlewares/auth').redirectHome

router.route(['/index','/'])
.get((req,res) => {
        const {userId} = req.session
        // console.log(req.session.userId)
        return res.render('index',{userId:userId})
    })

    router.route('/login')
    .get(redirectHome,(req,res) => {
    res.render('login')
    })
    .post(redirectHome,(req,res) => {
        // const {email}
        console.log('req body',req.body)
        const {email,password} = req.body
        if(email && password){
            db.query('SELECT id,name,email,password,userType FROM users WHERE email=?',[email],(err,result) => {
                // console.log(result)
                if(err){
                    console.log(error)
                    res.sendStatus(400)
                }
                else if (result.length<1 || result == undefined){
                    return res.render('error',{string:'Please Register first'})

                }

                else if(email == result[0].email){
                    if(password == result[0].password){
                        req.session.userId = result[0].id;
                        req.session.user=result[0]
                        console.log('user type',req.session.user.userType)
                        return res.render('home')
                        
                    }
                    else{
                        res.render('error',{string:'email/password does not match'})
                    }
                }
            })
           

        }
        else
            res.redirect('/login')
    })

router.route('/register')
    .get(redirectHome,(req,res) => {9
        res.render('register')
    })
    .post(redirectHome,(req,res) => {
        console.log('register reqBody',req.body)
        const{name,email,password,userType} = req.body
        if(name && email && password){
            db.query('SELECT email FROM users WHERE name=?',[name],(err,result,fields) => {
                // console.log(result)
                if(err){
                    console.log(err)
                    res.sendStatus(400)
                }
                else if(result.length < 1 || result == undefined){
                    query = "INSERT INTO users(name,email,password,userType) VALUES (?,?,?,?)";
                    val =[name,email,password,userType]
                    console.log('values are ',val)
                    db.query(query,val,(err,result) => {
                        if(err){
                            throw err;
                        }   
                        
                        console.log('Data inserted into Db\n')
                        console.log(result.affectedRows);
                        res.render('login')
                        return;

                    })
                }
                else if(result.length>0 && result[0].email && result[0].email === email){
                    console.log('result is ',result[0].email)
                    return res.render('error',{string:'Email already taken'})

                }
                

            })
        }
             
        
    })
    //home
router.route('/home')
 .get(redirectLogin,(req,res)=>{
    
     console.log(req.session.user.name)
return res.render('home',{name:req.session.user.name})

})

router.post('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err)
            return redirect('/home')
        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })
})
module.exports=router;
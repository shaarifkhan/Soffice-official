const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')
const db=require('./model/config')
const app = express()

const TWO_HOURS = 1000*60*60* 2

const {
    PORT = 3000,
    SESS_NAME = 'sid',
    SESS_SECRET='hello',
    SESS_LIFETIME = TWO_HOURS
} = process.env;

//middlewares
app.use(bodyParser({extended : true}))
app.use(session({ //session middleware
    name:SESS_NAME,
    saveUninitialized: false,
    resave:false,
    secret:SESS_SECRET,
    cookie:{
         sameSite: true,
         maxAge:SESS_LIFETIME,
         secure:false

    } 
}))
app.set('view engine','ejs')


const redirectLogin = (req,res,next) => {
    if(!req.session.userId)
        res.redirect('/login')
    else
        next()

}
const redirectHome = (req,res,next) => {
    if(req.session.userId)
        res.redirect('/home')
    else
        next()

}
app.use((req,res,next) => {
    const {userId} = req.session
    if (userId){
        console.log(`session id is ${userId}`)
    db.query('SELECT * FROM users WHERE id=?',[userId],(err,result) => {
        console.log(result[0])
        res.locals.user = result[0];
    })

         
    }
    next()
})
app.route('/')
    .get((req,res) => {
        const {userId} = req.session
        console.log(req.session.userId)
        console.log(req.session)
        return res.render('index',{userId:userId})
    })

    app.route('/login')
    .get(redirectHome,(req,res) => {
    res.render('login')
    })
    .post(redirectHome,(req,res) => {
        // const {email}
        console.log(req.body)
        const {email,password} = req.body
        if(email && password){
            db.query('SELECT id,name,email,password FROM users WHERE email=?',[email],(err,result) => {
                console.log(result)
                if(err){
                    console.log(error)
                    res.sendStatus(400)
                }
                else if (result.length<1 || result == undefined){
                    return res.render('error',{string:'Please Register first'})

                }

                else if(email == result[0].email){
                    console.log('tatti')
                    if(password == result[0].password){
                        req.session.userId = result[0].id;
                        return res.render('home',{name:result[0].name})
                        
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

// app.route('/register')
//     .get(redirectHome,(req,res) => {
//         res.render('register')
//     })
//     .post(redirectHome,(req,res) => {
//         console.log(req.body)
//         const{name,email,password} = req.body
//         if(name && email && password){
//             db.query('SELECT email FROM users WHERE name=?',[name],(err,result,fields) => {
//                 console.log(result)
//                 if(err){
//                     console.log(err)
//                     res.sendStatus(400)
//                 }
//                 else if(result.length < 1 || result == undefined){
//                     query = "INSERT INTO users(name,email,password) VALUES (?,?,?)";
//                     val =[name,email,password]
//                     console.log('values are ',val)
//                     db.query(query,val,(err,result) => {
//                         if(err){
//                             throw err;
//                         }   
                        
//                         console.log('Data inserted into Db\n')
//                         console.log(result.affectedRows);
//                         res.render('login')
//                         return;

//                     })
//                 }
//                 else if(result.length>0 && result[0].email && result[0].email === email){
//                     console.log('result is ',result[0].email)
//                     return res.render('error',{string:'Email already taken'})

//                 }
                

//             })
//         }
             
        
//             // if(!exist){
//             // val =[name,email,password]
//             // console.log('values are ',val)
//             // db.query(query,val,(err,result) => {
//             //     if(err){
//             //         throw err;
//             //     }   
                
//             //     console.log('Data inserted into Db\n')
//             //     console.log(result.affectedRows);

//             // })
//             // db.end()
//             // return res.render('login')
        
        

    
//     // res.redirect('/register')
//     })
    //home
app.get('/home',redirectLogin,(req,res)=>{
    const {user} = res.locals;
res.render('home',{name:user.name})

})
app.post('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err)
            return redirect('/home')
        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })
})

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Connected to database')
});

app.listen(PORT,()=> console.log(
    `http://localhost:${PORT}`
    ))
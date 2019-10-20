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

//getting routes
//setting the templating engine engine
app.set('view engine','ejs')
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
app.use(require('./routes/appRoutes'))
app.use(require('./routes/jobRoutes'))







//middleware to store session data in res.local object
//not using beacuse of asychronous operation
// app.use('/index',(req,res,next) => {
//     const {userId} = req.session
//     if (userId){
//         // console.log(`session id is ${userId}`)
//         db.querySync('SELECT * FROM users WHERE id=?',[userId],(err,result) => {
//             if(err)
//             throw err;
//             res.locals.user = result[0].name;
//             // console.log('middleware called and request is',res.locals)
//             console.log('first')
//         })
        
//     }
//     next()
// })


db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Connected to database')
});

app.listen(PORT,()=> console.log(
    `http://localhost:${PORT}`
    ))
module.exports.SESS_NAME = SESS_NAME;

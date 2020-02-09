var express = require('express')
var router=express.Router();
var redirectLogin=require('../middlewares/auth').redirectLogin
const jobPortal = require('../controllers/jobController')


router.route(redirectLogin,'/postJob')
.get((req,res) => {
    // res.render('postJob')
    return res.send('post job here')
})
.post(redirectLogin,(req,res) => {
    if(!req.session.user.userType == 'company')
    {
        return res.send('you dont have access rights to post job')
    }
    else if(req.body){
        const{jobTitle,jobType,jobCategory,experience,Qualification,postedOn,lastDate,location,salary,jobDescription}=req.body
        console.log(jobTitle)
        // return res.end('job posted');

        query='INSERT INTO job(jobTitle,jobType,jobCategory,experience,Qualification,postedOn,lastDate,location,salary,jobDescription)VALUES(?,?,?,?,?,?,?,?,?,?)'
        db.query(query,[jobTitle,jobType,jobCategory,experience,Qualification,postedOn,lastDate,location,salary,jobDescription],(err,result,fields) => {
            if(err){
                console.log(err);
                return res.status(500).send("internal server error!Please try again")

            }else{
            //    return res.render('home',{userType:'company'r})
            return res.end('job has been posted')
                
            }

        })
    }
})
router.route('/jobPortal')
.get(redirectLogin,(req,res) => {
    console.log('request =',req)

    query='SELECT * FROM jobs';
    db.query(query,(err,result) => {
        return res.render('jobPortal',{jobs:result,userType:req.session.user.userType})
    })
})
router.get('/searchJob',redirectLogin,(req,res) => {
    console.log(req.query.keyword)
    console.log(req.query.location)
    return res.send('ok')
    // let regExp=req.body.searchJob
    // console.log(req.body)
    // query='SELECT * FROM jobs WHERE title=?'
    // db.query(query,[regExp],(err,result) => {
    //     if(err){
    //         console.log(err)
    //     }
    //     else if (result.length==0){
    //         res.send('We donot have these kind of jobs rightnow please stay tuned,Job Portal will soon be updated')
    //     }
    //     else if(result.length>0){
    //         res.render('jobPortal',{jobs:result,userType:'all'})
    //     }
    // })
})
router.post('/deleteJob',redirectLogin,(req,res) => {
    let regExp=req.body.deleteJob
    query = 'DELETE FROM jobs WHERE title=?'
    db.query(query,[regExp],(err,result) => {
        if(err){
            console.log(err);
        }
        else{
            console.log('number of row deleted',result.affectedRows);
            return res.redirect(req.baseUrl+'/jobPortal')
        }
    })
})

module.exports=router;
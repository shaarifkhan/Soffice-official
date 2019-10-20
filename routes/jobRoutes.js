var express = require('express')
var router=express.Router();
var redirectLogin=require('../middlewares/auth').redirectLogin

router.route('/postJob')
.get(redirectLogin,(req,res) => {
    res.render('postJob')
})
.post(redirectLogin,(req,res) => {
    if(req.body){
        const{jobTitle,jobDescription,keywords,location}=req.body

        query='INSERT INTO jobs(title,description,keyword,location)VALUES(?,?,?,?)'
        db.query(query,[jobTitle,jobDescription,keywords,location],(err,result,fields) => {
            if(err){
                console.log(err);
                res.sendStatus(500)

            }else{
               return res.render('home',{userType:'company'})
            }

        })
    }
})
router.route('/jobPortal')
.get(redirectLogin,(req,res) => {
    query='SELECT * FROM jobs';
    db.query(query,(err,result) => {
        return res.render('jobPortal',{jobs:result,userType:req.session.user.userType})
    })
})
router.post('/searchJob',redirectLogin,(req,res) => {
    let regExp=req.body.searchJob
    console.log(req.body)
    query='SELECT * FROM jobs WHERE title=?'
    db.query(query,[regExp],(err,result) => {
        if(err){
            console.log(err)
        }
        else if (result.length==0){
            res.send('We donot have these kind of jobs rightnow please stay tuned,Job Portal will soon be updated')
        }
        else if(result.length>0){
            res.render('jobPortal',{jobs:result,userType:'all'})
        }
    })
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
            return res.redirect('/jobPortal')
        }
    })
})

module.exports=router;
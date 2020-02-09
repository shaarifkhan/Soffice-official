const router = require('express').Router()
const nodeMailer = require('nodemailer')

const smtpTransport = nodeMailer.createTransport(
    {
        service:"Gmail",
        auth:{
            user:"shaarifkhan999@gmail.com",
            pass:process.env.PASSWORD
        }
    }
)
router.get('/send',(req,res) => {
    console.log(req.get('host'))
    console.log(req.body.email)
    const {email} =req.body;
    host = req.get('host')
    redirectUrl = "http://"+host+"/verify?email="+email;
    console.log(redirectUrl);
    mailOptions = {
        to:req.body.email,
        subject:"Please Confirm your account",
        html:"Hello from Soffice!,<br>Please Click on this link to verify</br><br/> <a href="+redirectUrl+">https://soffice.com</a>"
    }
    smtpTransport.sendMail(mailOptions,(error,response) => {
        if(error){
            console.log(error)
            return res.end("error")
        }else{
            console.log("message sent:",response);
            return res.end("sent")
        }

    })
})

router.get('/verify',(req,res) => {
    console.log(req.query.email)
    val = req.query.email;
    query = "UPDATE users SET verified=true WHERE email=?";
    db.query(query,val,(err,dbResult) => {
        if(err){
            console.log(err);
            return res.end("Cannot verify at the moment!")
        }
        else{
            console.log(`email ${val} has been verified`)
            return res.end(`email ${val} has been verified`)
        }
    })


})

module.exports=router;
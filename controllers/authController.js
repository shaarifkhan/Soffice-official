const bcrypt = require('bcrypt')
const saltRounds = 10;
exports.login = (req,res) => {
    console.log(req.get('host'))
    console.log('req session id =',req.sessionID)
        const {email,password} = req.body
        if(email && password){
            db.query('SELECT id,name,email,password,userType FROM users WHERE email=?',[email],(err,dbResult) => {
                console.log('dbResult =',dbResult)
                if(err){
                    console.log(error)
                    res.sendStatus(400)
                }
                else if (dbResult.length<1 || dbResult == undefined){
                    // return res.render('error',{string:'Please Register first'})
                    return res.status(401).json({error:'Please Register First'})
                    
                }
                
                else if(email == dbResult[0].email){
                    bcrypt.compare(password,dbResult[0].password,(err,hashResult) => {
                        
                        if(hashResult){

                            req.session.userId = dbResult[0].id;
                            req.session.user=dbResult[0]
                            // res.send('logged in')
                            // return res.render('home')
                            return res.status(200).json({res:'loggedIn',userType:dbResult[0].userType})
                        }
                        else
                            return res.status(400).json({error:'email/password does not match'})
                        //   return res.render('error',{string:'email/password does not match'})
                    })
                    
                    
                    
                }
            })
            
            
        }
        else
        return res.redirect('/login')
}
exports.register = (req,res) => {
    console.log('register reqBody',req.body)
        const{name,email,password,userType} = req.body
        if(name && email && password){
            db.query('SELECT email FROM users WHERE email=?',[email],(err,dbResult,fields) => {
                console.log(dbResult)
                if(err){
                    console.log(err)
                    res.sendStatus(400)
                }
                else if(dbResult.length < 1 || dbResult == undefined){
                    query = "INSERT INTO users(name,email,password,userType) VALUES (?,?,?,?)";
                    bcrypt.hash(password,saltRounds,(error,hash) => {
                        val =[name,email,hash,userType]
                        console.log('values are ',val)
                        if(error){
                            console.log(error)
                            throw error;
                        }
                        db.query(query,val,(err,dbResult) => {
                            if(err){
                                throw err;
                            }   
                            
                            console.log('Data inserted into Db\n')
                            console.log(dbResult.affectedRows);
                            // res.render('login')
                            return res.json({
                                res:'Data inserted into Db'
                            })    
                        })
                        
                    })
                   
                }
                else if(dbResult.length>0 && dbResult[0].email && dbResult[0].email === email){
                    console.log('dbResult is ',dbResult[0].email)
                    // return res.render('error',{string:'Email already taken'})
                    return res.json({res:'email already taken'})

                }
                else
                console.log('none')
                return
                

            })
        }
             
}
exports.logout = (req,res) => {
    req.session.destroy((err) => {
        if(err)
            return redirect('/home')
        res.clearCookie(SESS_NAME)
        res.redirect('/login')
    })
}
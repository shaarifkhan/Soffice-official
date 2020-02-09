const mysql=require('mysql')
const db = mysql.createConnection(
    {
        host:'localhost',
        user:'shaarif',
        password:'root',
        database:'JUGAADI'

    }
)
db.connect((err) => {
    if(err){
        console.log(err)
        throw(err)
    }
})

global.db=db;
module.exports=db;
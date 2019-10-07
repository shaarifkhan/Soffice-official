const mysql=require('mysql')
const db = mysql.createConnection(
    {
        host:'localhost',
        user:'shaarif',
        password:'root',
        database:'JUGAADI'

    }
)

global.db=db;
module.exports=db;
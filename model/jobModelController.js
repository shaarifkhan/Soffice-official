const db = require('./config')

class JobPortal{
    constructor(){

    }
    getAllJobs(result){
        db.query("SELECT * FROM jobs",(err,res) => {
            if(err){
                console.log(err)
                result(null,err)
            }else{
                console.log(res)
                result(null,res)
            }
        })
    }
}
module.exports = JobPortal;
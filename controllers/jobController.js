const JobPortal = require('../model/jobModelController')
const jobPortal = new JobPortal();

exports.listAllJobs = ((req,res) => {
    jobPortal.getAllJobs((err,jobs) => {
        console.log('hello')
        if(err){
            console.log(err)
            res.send(err)
        }else {
            res.send(jobs)
        }
    })
})
exports.listParticularJobs
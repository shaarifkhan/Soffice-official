var router = require('express').Router();
var cors = require('cors')
const jobPortal = require('../controllers/jobController')

router.get('/jobs',cors(),jobPortal.listAllJobs)


module.exports = router;
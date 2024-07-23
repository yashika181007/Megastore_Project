const express = require('express');
const router = express.Router();
const { addblogpost,viewblogpost ,deleteblogpost,updateblogpost} = require('../controllers/blogpostcontroller');

router.post('/addblogpost', addblogpost);
router.get('/addblogpost', addblogpost);
router.get('/showblogpost', viewblogpost);
router.get('/updateblogpost', updateblogpost);
router.post('/updateblogpost', updateblogpost);


router.post('/deleteblogpost', deleteblogpost);



module.exports = router;

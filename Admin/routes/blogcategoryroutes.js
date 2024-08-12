const express = require('express');
const router = express.Router();
const {addblogcategory,viewblogcategory,deleteblogcegory,updateblogcategory} = require('../controllers/blogcategorycontroller');

router.get('/addblogcategory', addblogcategory);
router.post('/addblogcategory', addblogcategory);
router.get('/showblogcategory', viewblogcategory);
router.get('/updateblogcategory', updateblogcategory);
router.post('/updateblogcategory', updateblogcategory);
router.post('/deleteblogcat', deleteblogcegory);

module.exports = router;
  
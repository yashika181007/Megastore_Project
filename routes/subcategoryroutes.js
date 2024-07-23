const express = require('express');
const router = express.Router();
const { addSubcategoryController,getsubcategories,viewsubcategoryController,deleteSubcategoryController,updatesubcategoryController} = require('../controllers/subcategorycontroller');


router.post('/addsubcategory', addSubcategoryController);
router.get('/addsubcategory', getsubcategories)
router.get('/showsubcategory', viewsubcategoryController)
router.post('/addsubcategory', getsubcategories)
router.get('/deletesubcat', deleteSubcategoryController)
router.post('/deletesubcat', deleteSubcategoryController)
router.get('/updatesubcategory', updatesubcategoryController)
router.post('/updatesubcategory', updatesubcategoryController)





module.exports = router;

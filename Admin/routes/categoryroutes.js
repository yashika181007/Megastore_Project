const express = require('express');
const router = express.Router();
const { addcategoryController, viewCategoryController, updateCategoryController, deleteCategoryController } = require('../controllers/categorycontroller');

router.post('/addcategory', addcategoryController);
router.get('/addcategory', addcategoryController);
router.get('/showcategory', viewCategoryController);
router.get('/updatecategory', updateCategoryController);
router.post('/updatecategory', updateCategoryController);


router.post('/deletecat', deleteCategoryController);



module.exports = router;

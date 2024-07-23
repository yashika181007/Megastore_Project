const express = require('express');
const router = express.Router();
const { addSub_subcategoryController,getsub_subcategories,viewsub_subcategoryController,deleteSub_SubcategoryController,updatesub_subcategoryController} = require('../controllers/sub_subcategorycontroller');


router.post('/addsub_subcategory', addSub_subcategoryController);
router.get('/addsub_subcategory', getsub_subcategories)
router.get('/showsub_subcategory', viewsub_subcategoryController)
router.post('/deletesub_subcat', deleteSub_SubcategoryController)
router.get('/updatesub_subcategory', updatesub_subcategoryController)
router.post('/updatesub_subcategory', updatesub_subcategoryController)





module.exports = router;

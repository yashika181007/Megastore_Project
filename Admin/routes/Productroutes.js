const express = require('express');
const router = express.Router();

const { addproduct,getproduct, viewproduct, deleteproduct,updateproduct } = require('../controllers/ProductController');

router.post('/addproduct', addproduct);
router.get('/addproduct', getproduct);
router.get('/showproduct', viewproduct)
router.post('/deleteproduct', deleteproduct)
router.get('/updateproduct', updateproduct)
router.post('/updateproduct', updateproduct)



module.exports = router;

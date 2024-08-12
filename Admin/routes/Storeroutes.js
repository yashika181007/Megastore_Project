const express = require('express');
const router = express.Router();
const { addStoreController, viewStoreController, updateStoreController,deletestoreController } = require('../controllers/Storecontroller');

router.get('/addstores', addStoreController);
router.post('/addstores', addStoreController);
router.get('/showstores', viewStoreController);
router.get('/updatestores', updateStoreController); // Corrected URL path
router.post('/updatestores', updateStoreController); // Corrected URL path
router.post('/deletestore', deletestoreController);

module.exports = router;

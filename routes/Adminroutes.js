const express = require('express');
const router = express.Router();
const {Adminlogin,logout} = require('../controllers/Admincontroller');


router.get('/Adminlogin', Adminlogin);
router.post('/Adminlogin', Adminlogin);
router.get('/logout', logout);
module.exports = router;

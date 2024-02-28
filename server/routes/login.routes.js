const express = require('express');
const router = express.Router();
const loginCtrl = require('../controllers/login.controller');


router.post('/login', loginCtrl.login);
router.get('/logout', loginCtrl.logout);


module.exports = router;
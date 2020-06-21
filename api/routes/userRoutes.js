const express = require('express');

const router = express.Router();

const controller = require('../controller/userController');

router.post('/register', controller.createUser);
router.post('/configure', controller.configureUser);
router.post('/login', controller.loginUser);
 
module.exports = router;

const express = require('express');
const controller = require("../controllers/auth_controller");
const verifySignUp = require("../middleware/verifySignUp");
const router = express.Router();

router.post('/signin', controller.signIn);
router.post('/signup',verifySignUp.checkDuplicateEmail, controller.signUp);


module.exports = router;
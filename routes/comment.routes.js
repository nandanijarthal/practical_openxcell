const express = require('express');
const controller = require("../controllers/comment_controller");
const auth = require("../middleware/authJwt");
const router = express.Router();

router.post('/create',auth.verifyToken, controller.addComment);


module.exports = router;
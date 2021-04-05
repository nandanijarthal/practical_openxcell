const express = require('express');
const controller = require("../controllers/topic_controller");
const auth = require("../middleware/authJwt");
const router = express.Router();

router.post('/create',auth.verifyToken, controller.createTopic);
router.get('/list',auth.verifyToken, controller.getAll);

module.exports = router;
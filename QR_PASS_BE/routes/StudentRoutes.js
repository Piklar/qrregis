const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');

router.post('/register', studentController.registerStudent);
router.post('/generate-qr', studentController.generateQR);

module.exports = router;
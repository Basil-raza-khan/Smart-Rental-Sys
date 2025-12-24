const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authValidator = require('../validators/auth-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/signup', authValidator.validateSignup, authController.signup);
router.post('/login', authValidator.validateLogin, authController.login);
router.get('/me', authMiddleware.protect, authController.getMe);

module.exports = router;

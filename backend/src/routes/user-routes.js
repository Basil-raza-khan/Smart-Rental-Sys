const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const userValidator = require('../validators/user-validator');
// const authMiddleware = require('../middlewares/auth-middleware');

// All routes are public
router.get('/', userController.getAllUsers);
router.post('/', userValidator.validateCreateUser, userController.createUser);
router.get('/:id', userController.getUser);
router.patch('/:id', userValidator.validateUpdateUser, userController.updateUser);
router.patch('/:id/activate', userController.activateUser);
router.patch('/:id/deactivate', userController.deactivateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

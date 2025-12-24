const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property-controller');
const propertyValidator = require('../validators/property-validator');
const authMiddleware = require('../middlewares/auth-middleware');

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getProperty);
router.patch('/:id/assign-tenant', propertyController.assignTenant);

// Protected routes
router.post('/', propertyValidator.validateCreateProperty, propertyController.createProperty);
router.patch('/:id', authMiddleware.protect, propertyValidator.validateUpdateProperty, propertyController.updateProperty);
router.delete('/:id', authMiddleware.protect, propertyController.deleteProperty);

// Landlord routes
router.get('/landlord/my-properties', authMiddleware.protect, propertyController.getMyProperties);

module.exports = router;

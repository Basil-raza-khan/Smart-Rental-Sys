const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance-controller');
const maintenanceValidator = require('../validators/maintenance-validator');

// Public routes
router.get('/', maintenanceController.getAllMaintenance);
router.get('/:id', maintenanceController.getMaintenance);
router.post('/', maintenanceValidator.validateCreateMaintenance, maintenanceController.createMaintenance);
router.patch('/:id', maintenanceValidator.validateUpdateMaintenance, maintenanceController.updateMaintenance);

module.exports = router;

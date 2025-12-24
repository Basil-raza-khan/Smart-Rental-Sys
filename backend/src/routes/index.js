const express = require('express');
const router = express.Router();

// Import route modules (placeholders)
const authRoutes = require('./auth-routes');
const userRoutes = require('./user-routes');
const propertyRoutes = require('./property-routes');
const bookingRoutes = require('./booking-routes');
const maintenanceRoutes = require('./maintenance-routes');
const reviewRoutes = require('./review-routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/bookings', bookingRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;

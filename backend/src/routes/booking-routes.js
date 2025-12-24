const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking-controller');
const bookingValidator = require('../validators/booking-validator');
const authMiddleware = require('../middlewares/auth-middleware');

// Public routes
router.get('/', bookingController.getAllBookings);
router.post('/', bookingValidator.validateCreateBooking, bookingController.createBooking);
router.patch('/:id/status', bookingValidator.validateUpdateStatus, bookingController.updateBookingStatus);

// Protected routes
router.use(authMiddleware.protect);

router.get('/:id', bookingController.getBooking);

module.exports = router;

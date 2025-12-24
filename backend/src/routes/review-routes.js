const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review-controller');
const reviewValidator = require('../validators/review-validator');

// All routes are public
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReview);
router.post('/', reviewValidator.validateCreateReview, reviewController.createReview);
router.patch('/:id', reviewValidator.validateUpdateReview, reviewController.updateReview);
router.patch('/:id/reply', reviewValidator.validateReply, reviewController.replyToReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;

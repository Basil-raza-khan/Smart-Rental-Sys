const AppError = require('../utils/app-error');

exports.validateCreateReview = (req, res, next) => {
  const { property, rating, comment } = req.body;

  if (!property || property.trim() === '') {
    return next(new AppError('Property ID is required', 400));
  }

  if (rating === undefined || rating === null) {
    return next(new AppError('Rating is required', 400));
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return next(new AppError('Rating must be an integer between 1 and 5', 400));
  }

  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    return next(new AppError('Comment is required and must be a non-empty string', 400));
  }

  if (comment.length < 10) {
    return next(new AppError('Comment must be at least 10 characters long', 400));
  }

  next();
};

exports.validateUpdateReview = (req, res, next) => {
  const { rating, comment } = req.body;

  if (rating !== undefined) {
    if (typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return next(new AppError('Rating must be an integer between 1 and 5', 400));
    }
  }

  if (comment !== undefined) {
    if (typeof comment !== 'string' || comment.trim() === '') {
      return next(new AppError('Comment must be a non-empty string', 400));
    }

    if (comment.length < 10) {
      return next(new AppError('Comment must be at least 10 characters long', 400));
    }
  }

  next();
};

exports.validateReply = (req, res, next) => {
  const { landlordReply } = req.body;

  if (!landlordReply || typeof landlordReply !== 'string' || landlordReply.trim() === '') {
    return next(new AppError('Landlord reply is required and must be a non-empty string', 400));
  }

  if (landlordReply.length < 5) {
    return next(new AppError('Reply must be at least 5 characters long', 400));
  }

  next();
};
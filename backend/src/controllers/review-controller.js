const Review = require('../models/review-model');
const Property = require('../models/property-model');
const Booking = require('../models/booking-model');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const { property, tenant, landlord, minRating, maxRating } = req.query;
  const filter = {};
  if (property) filter.property = property;
  if (tenant) filter.tenant = tenant;
  if (landlord) filter.landlord = landlord;
  if (minRating || maxRating) {
    filter.rating = {};
    if (minRating) filter.rating.$gte = Number(minRating);
    if (maxRating) filter.rating.$lte = Number(maxRating);
  }
  const reviews = await Review.find(filter)
    .populate('property', 'title address')
    .populate('tenant', 'name email')
    .populate('landlord', 'name email')
    .sort('-createdAt');
  res.status(200).json({
    success: true,
    results: reviews.length,
    data: {
      reviews
    }
  });
});
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('property')
    .populate('tenant', 'name email')
    .populate('landlord', 'name email');
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  res.status(200).json({
    success: true,
    data: {
      review
    }
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  const { tenant } = req.body;
  if (!tenant) {
    return next(new AppError('Tenant ID is required', 400));
  }
  const property = await Property.findById(req.body.property);
  if (!property) {
    return next(new AppError('Property not found', 404));
  }
  // Check if tenant has a confirmed booking for this property
  const confirmedBooking = await Booking.findOne({
    property: req.body.property,
    tenant: tenant,
    status: 'confirmed'
  });
  if (!confirmedBooking) {
    return next(new AppError('You can only review properties you have occupied', 403));
  }
  const existingReview = await Review.findOne({
    property: req.body.property,
    tenant: tenant
  });
  if (existingReview) {
    return next(new AppError('You have already reviewed this property', 400));
  }
  const reviewData = {
    ...req.body,
    tenant: tenant,
    landlord: property.landlord
  };
  const review = await Review.create(reviewData);
  await review.populate('property tenant landlord');
  res.status(201).json({
    success: true,
    data: {
      review
    }
  });
});
exports.updateReview = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return next(new AppError('User ID is required', 400));
  }
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  if (review.tenant.toString() !== userId) {
    return next(new AppError('You are not authorized to update this review', 403));
  }
  const allowedFields = ['rating', 'comment', 'images'];
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  review = await Review.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: {
      review
    }
  });
});
exports.replyToReview = catchAsync(async (req, res, next) => {
  const { landlordReply, userId } = req.body;
  if (!landlordReply) {
    return next(new AppError('Please provide a reply', 400));
  }
  if (!userId) {
    return next(new AppError('User ID is required', 400));
  }
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  if (review.landlord.toString() !== userId) {
    return next(new AppError('You are not authorized to reply to this review', 403));
  }
  review.landlordReply = landlordReply;
  review.landlordReplyDate = new Date();
  await review.save();
  res.status(200).json({
    success: true,
    data: {
      review
    }
  });
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    return next(new AppError('User ID is required', 400));
  }
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }
  if (review.tenant.toString() !== userId && review.landlord.toString() !== userId) {
    return next(new AppError('You are not authorized to delete this review', 403));
  }
  await Review.findByIdAndDelete(req.params.id);
  res.status(204).json({
    success: true,
    data: null
  });
});


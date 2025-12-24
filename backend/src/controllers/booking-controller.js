const Booking = require('../models/booking-model');
const Property = require('../models/property-model');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const { status, tenant, landlord, property } = req.query;
  const filter = {};
  if (status && status !== 'history') {
    filter.status = status;
  }
  if (tenant) filter.tenant = tenant;
  if (landlord) filter.landlord = landlord;
  if (property) filter.property = property;
  const bookings = await Booking.find(filter)
    .populate('property', 'title address propertyType bedrooms bathrooms rent')
    .populate('tenant', 'name email phone')
    .populate('landlord', 'name email phone')
    .sort('-createdAt');
  res.status(200).json({
    success: true,
    results: bookings.length,
    data: {
      bookings
    }
  });
});
exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('property')
    .populate('tenant', 'name email phone')
    .populate('landlord', 'name email phone');
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }
  if (req.user.role === 'tenant' && booking.tenant._id.toString() !== req.user.id) {
    return next(new AppError('You are not authorized to view this booking', 403));
  }
  if (req.user.role === 'landlord' && booking.landlord._id.toString() !== req.user.id) {
    return next(new AppError('You are not authorized to view this booking', 403));
  }
  res.status(200).json({
    success: true,
    data: {
      booking
    }
  });
});
exports.createBooking = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.body.property);
  if (!property) {
    return next(new AppError('Property not found', 404));
  }
  if (property.status !== 'available') {
    return next(new AppError('Property is not available for booking', 400));
  }
  const bookingData = {
    ...req.body,
    tenant: req.body.tenant,
    landlord: property.landlord,
    monthlyRent: property.rent,
    depositAmount: property.deposit
  };
  const booking = await Booking.create(bookingData);
  await booking.populate('property tenant landlord');
  res.status(201).json({
    success: true,
    data: {
      booking
    }
  });
});
exports.updateBookingStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id)
    .populate('property')
    .populate('tenant')
    .populate('landlord');
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }
  const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!allowedStatuses.includes(status)) {
    return next(new AppError('Invalid status provided', 400));
  }
  booking.status = status;
  await booking.save();
  // Update property status/tenant where appropriate
  const propId = booking.property && booking.property._id ? booking.property._id : booking.property;
  const property = await Property.findById(propId);
  if (status === 'confirmed') {
    property.currentTenant = booking.tenant._id || booking.tenant;
    property.status = 'occupied';
  } else if (status === 'cancelled' || status === 'completed') {
    if (property.currentTenant && property.currentTenant.toString() === (booking.tenant._id ? booking.tenant._id.toString() : booking.tenant.toString())) {
      property.currentTenant = null;
      property.status = 'available';
    }
  }
  await property.save();
  res.status(200).json({
    success: true,
    data: {
      booking
    }
  });
});


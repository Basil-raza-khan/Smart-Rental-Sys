const Property = require('../models/property-model');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');
exports.getAllProperties = catchAsync(async (req, res, next) => {
  const { status, city, minRent, maxRent, bedrooms, propertyType, landlord } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (city) filter['address.city'] = new RegExp(city, 'i');
  if (bedrooms) filter.bedrooms = Number(bedrooms);
  if (propertyType) filter.propertyType = propertyType;
  if (landlord) filter.landlord = landlord;
  if (minRent || maxRent) {
    filter.rent = {};
    if (minRent) filter.rent.$gte = Number(minRent);
    if (maxRent) filter.rent.$lte = Number(maxRent);
  }
  const properties = await Property.find(filter)
    .populate('landlord', 'name email phone')
    .populate('currentTenant', 'name email phone')
    .sort('-createdAt');
  res.status(200).json({
    success: true,
    results: properties.length,
    data: {
      properties
    }
  });
});
exports.getProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id)
    .populate('landlord', 'name email phone')
    .populate('currentTenant', 'name email phone');
  if (!property) {
    return next(new AppError('Property not found', 404));
  }
  res.status(200).json({
    success: true,
    data: {
      property
    }
  });
});
exports.createProperty = catchAsync(async (req, res, next) => {
  const propertyData = {
    ...req.body,
    landlord: req.body.landlord
  };
  const property = await Property.create(propertyData);
  res.status(201).json({
    success: true,
    data: {
      property
    }
  });
});
exports.updateProperty = catchAsync(async (req, res, next) => {
  let property = await Property.findById(req.params.id);
  if (!property) {
    return next(new AppError('Property not found', 404));
  }
  if (req.user.role === 'landlord' && property.landlord.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not authorized to update this property', 403));
  }
  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: {
      property
    }
  });
});
exports.deleteProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new AppError('Property not found', 404));
  }
  if (req.user.role === 'landlord' && property.landlord.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not authorized to delete this property', 403));
  }
  await Property.findByIdAndDelete(req.params.id);
  res.status(204).json({
    success: true,
    data: null
  });
});
exports.getMyProperties = catchAsync(async (req, res, next) => {
  // Handle both ObjectId and string landlord IDs
  const properties = await Property.find({
    $or: [
      { landlord: req.user._id },
      { landlord: req.user.id }
    ]
  })
    .populate('currentTenant', 'name email phone')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    results: properties.length,
    data: {
      properties
    }
  });
});
exports.assignTenant = catchAsync(async (req, res, next) => {
  const { tenantId, landlordId } = req.body;
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new AppError('Property not found', 404));
  }
  // Validate that the landlord owns this property
  if (property.landlord.toString() !== landlordId) {
    return next(new AppError('You are not authorized to assign tenants to this property', 403));
  }
  property.currentTenant = tenantId;
  property.status = tenantId ? 'occupied' : 'available';
  await property.save();
  res.status(200).json({
    success: true,
    data: {
      property
    }
  });
});


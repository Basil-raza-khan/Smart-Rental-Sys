const Maintenance = require('../models/maintenance-model');
const Property = require('../models/property-model');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');

exports.getAllMaintenance = catchAsync(async (req, res, next) => {
  const { status, priority, property, userId, role } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (property) filter.property = property;
  
  // If user is a tenant, only show their own requests
  if (role === 'tenant' && userId) {
    filter.reportedBy = userId;
  }
  
  // If user is a landlord, only show requests for their properties
  if (role === 'landlord' && userId) {
    const landlordProperties = await Property.find({ landlord: userId }).select('_id');
    const propertyIds = landlordProperties.map(prop => prop._id);
    filter.property = { $in: propertyIds };
  }
  
  const maintenanceRequests = await Maintenance.find(filter)
    .populate('property', 'title address landlord')
    .populate('reportedBy', 'name email phone')
    .sort('-createdAt');
  res.status(200).json({
    success: true,
    results: maintenanceRequests.length,
    data: {
      maintenanceRequests
    }
  });
});

exports.getMaintenance = catchAsync(async (req, res, next) => {
  const { userId, role } = req.query;
  const maintenance = await Maintenance.findById(req.params.id)
    .populate('property')
    .populate('reportedBy', 'name email phone');
  if (!maintenance) {
    return next(new AppError('Maintenance request not found', 404));
  }
  // If user is a tenant, only allow viewing their own requests
  if (role === 'tenant' && userId && maintenance.reportedBy._id.toString() !== userId) {
    return next(new AppError('You are not authorized to view this maintenance request', 403));
  }
  // If user is a landlord, only allow viewing requests for their properties
  if (role === 'landlord' && userId && maintenance.property.landlord.toString() !== userId) {
    return next(new AppError('You are not authorized to view this maintenance request', 403));
  }
  res.status(200).json({
    success: true,
    data: {
      maintenance
    }
  });
});

exports.createMaintenance = catchAsync(async (req, res, next) => {
  const { userId, role } = req.body;
  
  if (role !== 'tenant') {
    return next(new AppError('Only tenants can create maintenance requests', 403));
  }
  
  const property = await Property.findById(req.body.property);
  if (!property) {
    return next(new AppError('Property not found', 404));
  }
  
  const maintenanceData = {
    ...req.body,
    reportedBy: userId
  };
  const maintenance = await Maintenance.create(maintenanceData);
  await maintenance.populate('property reportedBy');
  res.status(201).json({
    success: true,
    data: {
      maintenance
    }
  });
});

exports.updateMaintenance = catchAsync(async (req, res, next) => {
  const { userId, role } = req.body;
  
  let maintenance = await Maintenance.findById(req.params.id)
    .populate('property');
  if (!maintenance) {
    return next(new AppError('Maintenance request not found', 404));
  }
  
  // If user is a tenant, only allow updating their own requests
  if (role === 'tenant' && userId && maintenance.reportedBy.toString() !== userId) {
    return next(new AppError('You are not authorized to update this maintenance request', 403));
  }
  
  // If user is a landlord, only allow updating requests for their properties
  if (role === 'landlord' && userId && maintenance.property.landlord.toString() !== userId) {
    return next(new AppError('You are not authorized to update this maintenance request', 403));
  }
  
  if (req.body.status === 'resolved') {
    req.body.completedDate = new Date();
  }
  if (req.body.status === 'in_progress') {
    req.body.scheduledDate = req.body.scheduledDate || new Date();
  }
  
  maintenance = await Maintenance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: {
      maintenance
    }
  });
});

exports.deleteMaintenance = catchAsync(async (req, res, next) => {
  const { userId, role } = req.body;
  
  const maintenance = await Maintenance.findById(req.params.id);
  if (!maintenance) {
    return next(new AppError('Maintenance request not found', 404));
  }
  
  // If user is a tenant, only allow deleting their own requests
  if (role === 'tenant' && userId && maintenance.reportedBy.toString() !== userId) {
    return next(new AppError('You are not authorized to delete this maintenance request', 403));
  }
  
  await Maintenance.findByIdAndDelete(req.params.id);
  res.status(204).json({
    success: true,
    data: null
  });
});


const AppError = require('../utils/app-error');

exports.validateCreateProperty = (req, res, next) => {
  const { title, description, address, propertyType, bedrooms, bathrooms, area, rent, deposit, landlord } = req.body;

  if (!title || title.trim() === '') {
    return next(new AppError('Title is required', 400));
  }

  if (!description || description.trim() === '') {
    return next(new AppError('Description is required', 400));
  }

  if (!address || !address.street || !address.city || !address.state || !address.zipCode || !address.country) {
    return next(new AppError('Complete address is required (street, city, state, zipCode, country)', 400));
  }

  if (!propertyType || !['apartment', 'house', 'condo', 'townhouse', 'studio'].includes(propertyType)) {
    return next(new AppError('Valid property type is required (apartment, house, condo, townhouse, studio)', 400));
  }

  if (!bedrooms || bedrooms < 0) {
    return next(new AppError('Number of bedrooms is required and must be non-negative', 400));
  }

  if (!bathrooms || bathrooms < 0) {
    return next(new AppError('Number of bathrooms is required and must be non-negative', 400));
  }

  if (!area || area <= 0) {
    return next(new AppError('Area must be greater than 0', 400));
  }

  if (!rent || rent <= 0) {
    return next(new AppError('Rent must be greater than 0', 400));
  }

  if (!deposit || deposit < 0) {
    return next(new AppError('Deposit must be non-negative', 400));
  }

  if (!landlord) {
    return next(new AppError('Landlord is required', 400));
  }

  next();
};

exports.validateUpdateProperty = (req, res, next) => {
  const { address, propertyType, bedrooms, bathrooms, area, rent, deposit } = req.body;

  if (address && (!address.street || !address.city || !address.state || !address.zipCode || !address.country)) {
    return next(new AppError('Complete address is required (street, city, state, zipCode, country)', 400));
  }

  if (propertyType && !['apartment', 'house', 'condo', 'townhouse', 'studio'].includes(propertyType)) {
    return next(new AppError('Valid property type is required (apartment, house, condo, townhouse, studio)', 400));
  }

  if (bedrooms !== undefined && bedrooms < 0) {
    return next(new AppError('Number of bedrooms must be non-negative', 400));
  }

  if (bathrooms !== undefined && bathrooms < 0) {
    return next(new AppError('Number of bathrooms must be non-negative', 400));
  }

  if (area && area <= 0) {
    return next(new AppError('Area must be greater than 0', 400));
  }

  if (rent && rent <= 0) {
    return next(new AppError('Rent must be greater than 0', 400));
  }

  if (deposit && deposit <= 0) {
    return next(new AppError('Deposit must be greater than 0', 400));
  }

  next();
};
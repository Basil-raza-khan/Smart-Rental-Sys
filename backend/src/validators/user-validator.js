const AppError = require('../utils/app-error');

exports.validateCreateUser = (req, res, next) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || name.trim() === '') {
    return next(new AppError('Name is required', 400));
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('Valid email is required', 400));
  }
  if (!password || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }
  if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    return next(new AppError('Valid phone number is required', 400));
  }
  if (!role || !['tenant', 'landlord', 'admin'].includes(role)) {
    return next(new AppError('Role must be tenant, landlord, or admin', 400));
  }

  next();
};

exports.validateUpdateUser = (req, res, next) => {
  const { name, email, phone, role, isActive } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return next(new AppError('Name must be a non-empty string', 400));
  }

  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('Valid email is required', 400));
  }

  if (phone !== undefined && !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    return next(new AppError('Valid phone number is required', 400));
  }

  if (role !== undefined && !['tenant', 'landlord', 'admin'].includes(role)) {
    return next(new AppError('Role must be either tenant, landlord, or admin', 400));
  }

  if (isActive !== undefined && typeof isActive !== 'boolean') {
    return next(new AppError('isActive must be a boolean value', 400));
  }

  next();
};
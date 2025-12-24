const AppError = require('../utils/app-error');

exports.validateSignup = (req, res, next) => {
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
  if (role && !['tenant', 'landlord'].includes(role)) {
    return next(new AppError('Role must be either tenant or landlord', 400));
  }

  next();
};

exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('Valid email is required', 400));
  }
  if (!password || password.length === 0) {
    return next(new AppError('Password is required', 400));
  }

  next();
};
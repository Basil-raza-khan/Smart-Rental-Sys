const AppError = require('../utils/app-error');

exports.validateCreateBooking = (req, res, next) => {
  const { property, startDate, endDate } = req.body;

  if (!property || property.trim() === '') {
    return next(new AppError('Property ID is required', 400));
  }

  if (startDate && isNaN(Date.parse(startDate))) {
    return next(new AppError('Invalid start date format (YYYY-MM-DD)', 400));
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    return next(new AppError('Invalid end date format (YYYY-MM-DD)', 400));
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return next(new AppError('End date must be after start date', 400));
    }
  }

  next();
};

exports.validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;

  if (!status || status.trim() === '') {
    return next(new AppError('Status is required', 400));
  }

  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status)) {
    return next(new AppError(`Status must be one of: ${validStatuses.join(', ')}`, 400));
  }

  next();
};
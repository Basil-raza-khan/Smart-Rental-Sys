const AppError = require('../utils/app-error');

exports.validateCreateMaintenance = (req, res, next) => {
  const { property, title, description, category, priority } = req.body;

  if (!property || property.trim() === '') {
    return next(new AppError('Property ID is required', 400));
  }

  if (!title || title.trim() === '') {
    return next(new AppError('Title is required', 400));
  }

  if (!description || description.trim() === '') {
    return next(new AppError('Description is required', 400));
  }

  if (!category || category.trim() === '') {
    return next(new AppError('Category is required', 400));
  }

  const validCategories = ['plumbing', 'electrical', 'hvac', 'structural', 'appliance', 'other'];
  if (!validCategories.includes(category.toLowerCase())) {
    return next(new AppError(`Category must be one of: ${validCategories.join(', ')}`, 400));
  }

  if (!priority || priority.trim() === '') {
    return next(new AppError('Priority is required', 400));
  }

  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  if (!validPriorities.includes(priority.toLowerCase())) {
    return next(new AppError(`Priority must be one of: ${validPriorities.join(', ')}`, 400));
  }

  next();
};

exports.validateUpdateMaintenance = (req, res, next) => {
  const { status, priority, category, scheduledDate, estimatedCost, actualCost } = req.body;

  if (status) {
    const validStatuses = ['reported', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return next(new AppError(`Status must be one of: ${validStatuses.join(', ')}`, 400));
    }
  }

  if (priority) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority.toLowerCase())) {
      return next(new AppError(`Priority must be one of: ${validPriorities.join(', ')}`, 400));
    }
  }

  if (category) {
    const validCategories = ['plumbing', 'electrical', 'hvac', 'structural', 'appliance', 'other'];
    if (!validCategories.includes(category.toLowerCase())) {
      return next(new AppError(`Category must be one of: ${validCategories.join(', ')}`, 400));
    }
  }

  if (scheduledDate && isNaN(Date.parse(scheduledDate))) {
    return next(new AppError('Valid scheduled date is required (YYYY-MM-DD format)', 400));
  }

  if (estimatedCost !== undefined && (estimatedCost < 0 || isNaN(estimatedCost))) {
    return next(new AppError('Estimated cost must be a positive number', 400));
  }

  if (actualCost !== undefined && (actualCost < 0 || isNaN(actualCost))) {
    return next(new AppError('Actual cost must be a positive number', 400));
  }

  next();
};    
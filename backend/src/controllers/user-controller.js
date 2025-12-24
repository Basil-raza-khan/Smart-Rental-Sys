const User = require('../models/user-model');
const AppError = require('../utils/app-error');
const catchAsync = require('../utils/catch-async');
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { role, isActive } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  const users = await User.find(filter).sort('-createdAt');
  res.status(200).json({
    success: true,
    results: users.length,
    data: {
      users
    }
  });
});
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, role, address } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 400));
  }
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'tenant',
    address
  });
  res.status(201).json({
    success: true,
    data: {
      user
    }
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  // Admins can update any user
  const updates = { ...req.body };
  if (updates.password) delete updates.password; // password updates should go through updatePassword
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({
    success: true,
    data: { user }
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({ success: true, data: null });
});

exports.activateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: true },
    { new: true, runValidators: true }
  );
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({
    success: true,
    message: 'User activated successfully',
    data: { user }
  });
});

exports.deactivateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true, runValidators: true }
  );
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({
    success: true,
    message: 'User deactivated successfully',
    data: { user }
  });
});


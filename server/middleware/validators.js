const { body, validationResult } = require('express-validator');

// Validation error handler middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Auth validation rules
const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('role')
    .optional()
    .isIn(['user', 'recycler', 'logistics']).withMessage('Role must be user, recycler, or logistics'),
  validate,
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate,
];

const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  validate,
];

const resetPasswordValidator = [
  (req, res, next) => {
    if (req.query?.token && !req.body?.token) {
      req.body.token = req.query.token;
    }
    next();
  },
  body('token')
    .trim()
    .notEmpty().withMessage('Reset token is required'),
  (req, res, next) => {
    const password = req.body.password || req.body.newPassword;
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }
    next();
  },
  validate,
];

// Pickup validation rules
const pickupValidator = [
  body('address')
    .trim()
    .notEmpty().withMessage('Pickup address is required'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('scheduledDate')
    .notEmpty().withMessage('Scheduled date is required'),
  body('timeSlot')
    .trim()
    .notEmpty().withMessage('Time slot is required'),
  validate,
];

// Waste item validation rules
const wasteValidator = [
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  body('itemName')
    .trim()
    .notEmpty().withMessage('Item name is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
  validate,
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  pickupValidator,
  wasteValidator,
};

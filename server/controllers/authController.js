const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔐 Generate JWT Token
const generateToken = id => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'ecollect_default_secret_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Format user response object
const formatUserResponse = user => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  city: user.city,
  phone: user.phone || '',
  role: user.role,
  points: user.points || 0,
  level: user.level || 'Eco Starter',
  companyName: user.companyName || '',
  companyAddress: user.companyAddress || '',
  wasteCategories: user.wasteCategories || [],
  isVerified: user.isVerified || false,
  serviceArea: user.serviceArea || '',
  vehicleType: user.vehicleType || '',
  availability: user.availability || 'available',
  totalItemsRecycled: user.totalItemsRecycled || 0,
  co2Saved: user.co2Saved || 0,
});

// @desc    Register user (user, recycler, or logistics partner)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      city,
      phone,
      role = 'user',
      companyName,
      companyAddress,
      wasteCategories,
      serviceArea,
      vehicleType,
    } = req.body;

    // Validate role
    if (role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be registered publicly.',
      });
    }

    if (!['user', 'recycler', 'logistics'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Must be user, recycler, or logistics.',
      });
    }

    // Validate standard input
    if (!name || !email || !password || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and city.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if email exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Format waste categories if string
    let parsedCategories = [];
    if (Array.isArray(wasteCategories)) {
      parsedCategories = wasteCategories;
    } else if (typeof wasteCategories === 'string' && wasteCategories.trim()) {
      parsedCategories = wasteCategories.split(',').map(c => c.trim()).filter(Boolean);
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      city: city.trim(),
      phone: phone ? phone.trim() : '',
      role,
      companyName: companyName ? companyName.trim() : '',
      companyAddress: companyAddress ? companyAddress.trim() : '',
      wasteCategories: parsedCategories,
      serviceArea: serviceArea ? serviceArea.trim() : '',
      vehicleType: vehicleType ? vehicleType.trim() : '',
      isVerified: role === 'user', // regular users auto-verified, recyclers verified by admin
    });

    return res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`,
      token: generateToken(user._id),
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token: generateToken(user._id),
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('GETME ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      city,
      companyName,
      companyAddress,
      wasteCategories,
      serviceArea,
      vehicleType,
      availability,
    } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (city) updateFields.city = city.trim();
    if (companyName !== undefined) updateFields.companyName = companyName.trim();
    if (companyAddress !== undefined) updateFields.companyAddress = companyAddress.trim();
    if (serviceArea !== undefined) updateFields.serviceArea = serviceArea.trim();
    if (vehicleType !== undefined) updateFields.vehicleType = vehicleType.trim();
    if (availability !== undefined) updateFields.availability = availability;
    if (wasteCategories !== undefined) {
      updateFields.wasteCategories = Array.isArray(wasteCategories)
        ? wasteCategories
        : wasteCategories.split(',').map(c => c.trim()).filter(Boolean);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateFields);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// @desc    Forgot password stub
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't leak user existence
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
      });
    }

    // In demo/local mode, acknowledge request
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email address.',
      demoToken: 'demo-reset-token-' + Date.now(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing password reset request' });
  }
};

// @desc    Reset password stub
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  formatUserResponse,
};

const User = require('../models/User');
const Pickup = require('../models/Pickup');
const WasteItem = require('../models/WasteItem');

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Admin
const getAdminDashboard = async (req, res, next) => {
  try {
    const totalRequests = await Pickup.countDocuments();
    const pendingVerification = await Pickup.countDocuments({ status: 'pending' });
    const verified = await Pickup.countDocuments({ status: 'verified' });
    const activeCollections = await Pickup.countDocuments({
      status: { $in: ['assigned', 'pickup_scheduled', 'collected', 'recycling_in_progress'] },
    });
    const completedRecycling = await Pickup.countDocuments({ status: 'completed' });

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRecyclers = await User.countDocuments({ role: 'recycler' });
    const totalLogistics = await User.countDocuments({ role: 'logistics' });

    const recentRequests = await Pickup.find()
      .populate('user', 'name email city phone')
      .populate('recycler', 'name companyName')
      .populate('logisticsPartner', 'name companyName vehicleType')
      .sort({ createdAt: -1 })
      .limit(6);

    const categoryBreakdown = await WasteItem.aggregate();

    res.status(200).json({
      success: true,
      stats: {
        totalRequests,
        pendingVerification,
        verified,
        activeCollections,
        completedRecycling,
        totalUsers,
        registeredRecyclers: totalRecyclers,
        registeredLogistics: totalLogistics,
      },
      recentRequests,
      categoryBreakdown,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let filter = {};
    if (role && role !== 'all') {
      filter.role = role;
    }

    let users = await User.find(filter).sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        u =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.companyName && u.companyName.toLowerCase().includes(q)) ||
          (u.city && u.city.toLowerCase().includes(q))
      );
    }

    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (activate / deactivate)
// @route   PUT /api/admin/users/:id/status
// @access  Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recyclers
// @route   GET /api/admin/recyclers
// @access  Admin
const getRecyclers = async (req, res, next) => {
  try {
    const recyclers = await User.find({ role: 'recycler' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: recyclers.length, recyclers });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or unverify a recycler
// @route   PUT /api/admin/recyclers/:id/verify
// @access  Admin
const verifyRecycler = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    const recycler = await User.findById(req.params.id);
    if (!recycler || recycler.role !== 'recycler') {
      return res.status(404).json({ success: false, message: 'Recycler not found' });
    }

    recycler.isVerified = isVerified !== undefined ? isVerified : true;
    await recycler.save();

    res.status(200).json({
      success: true,
      message: `Recycler verification updated to: ${recycler.isVerified}`,
      recycler,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all logistics partners
// @route   GET /api/admin/logistics
// @access  Admin
const getLogisticsPartners = async (req, res, next) => {
  try {
    const partners = await User.find({ role: 'logistics' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: partners.length, partners });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports and analytics
// @route   GET /api/admin/reports
// @access  Admin
const getReports = async (req, res, next) => {
  try {
    const totalCollected = 1450; // kg
    const totalRecycled = 1280; // kg
    const monthlyStats = [
      { month: 'Jun', collected: 120, recycled: 110 },
      { month: 'Jul', collected: 190, recycled: 175 },
      { month: 'Aug', collected: 240, recycled: 220 },
      { month: 'Sep', collected: 310, recycled: 290 },
      { month: 'Oct', collected: 380, recycled: 350 },
      { month: 'Nov', collected: 210, recycled: 135 },
    ];

    res.status(200).json({
      success: true,
      reports: {
        totalCollectedKg: totalCollected,
        totalRecycledKg: totalRecycled,
        recyclingRate: Math.round((totalRecycled / totalCollected) * 100) + '%',
        monthlyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
  getRecyclers,
  verifyRecycler,
  getLogisticsPartners,
  getReports,
};

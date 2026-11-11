const Pickup = require('../models/Pickup');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get recycler dashboard statistics
// @route   GET /api/recyclers/dashboard
// @access  Recycler
const getRecyclerDashboard = async (req, res, next) => {
  try {
    const recyclerId = req.user._id.toString();

    const allAssigned = await Pickup.find({ recycler: recyclerId });
    const assignedCount = allAssigned.length;
    const incomingCount = allAssigned.filter(
      p => p.status === 'collected' || p.logisticsStatus === 'in_transit'
    ).length;
    const awaitingProcessing = allAssigned.filter(
      p => p.logisticsStatus === 'delivered' && p.recyclerStatus !== 'completed'
    ).length;
    const inProgressCount = allAssigned.filter(
      p => p.status === 'recycling_in_progress' || p.recyclerStatus === 'processing'
    ).length;
    const completedCount = allAssigned.filter(
      p => p.status === 'completed' || p.recyclerStatus === 'completed'
    ).length;

    // Recent 5 pickups
    const recentPickups = await Pickup.find({ recycler: recyclerId })
      .populate('user', 'name city phone')
      .populate('logisticsPartner', 'name companyName vehicleType phone')
      .sort({ updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        assignedRequests: assignedCount,
        incomingCollections: incomingCount,
        awaitingProcessing,
        recyclingInProgress: inProgressCount,
        completedRecycling: completedCount,
      },
      recentPickups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pickups assigned to this recycler
// @route   GET /api/recyclers/assigned
// @access  Recycler
const getAssignedRequests = async (req, res, next) => {
  try {
    const { status } = req.query;
    const recyclerId = req.user._id.toString();

    let pickups = await Pickup.find({ recycler: recyclerId })
      .populate('user', 'name email city phone address')
      .populate('logisticsPartner', 'name companyName vehicleType phone')
      .populate('items')
      .sort({ createdAt: -1 });

    if (status && status !== 'all') {
      pickups = pickups.filter(p => p.recyclerStatus === status || p.status === status);
    }

    res.status(200).json({ success: true, count: pickups.length, pickups });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept assignment
// @route   PUT /api/recyclers/pickups/:id/accept
// @access  Recycler
const acceptAssignment = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found' });
    }

    if (pickup.recycler?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    pickup.recyclerStatus = 'accepted';
    await pickup.save();

    await Notification.create({
      user: pickup.user,
      title: 'Recycler Accepted Request',
      message: `${req.user.companyName || req.user.name} accepted your e-waste collection request.`,
      type: 'success',
      link: '/user/track',
    });

    res.status(200).json({ success: true, message: 'Assignment accepted.', pickup });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject assignment
// @route   PUT /api/recyclers/pickups/:id/reject
// @access  Recycler
const rejectAssignment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found' });
    }

    if (pickup.recycler?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    pickup.recycler = null;
    pickup.recyclerStatus = 'rejected';
    pickup.processingNotes = reason || 'Declined by recycler';
    pickup.status = 'verified'; // Return to verified pool for admin reassignment
    await pickup.save();

    res.status(200).json({
      success: true,
      message: 'Assignment rejected. Returned to admin pool for reassignment.',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recycling processing details
// @route   PUT /api/recyclers/pickups/:id/operations
// @access  Recycler
const updateOperations = async (req, res, next) => {
  try {
    const {
      receivedWeight,
      recoveredMaterials,
      processingNotes,
      status, // 'processing' or 'completed'
    } = req.body;

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found' });
    }

    if (pickup.recycler?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    if (receivedWeight !== undefined) pickup.receivedWeight = receivedWeight;
    if (recoveredMaterials !== undefined) pickup.recoveredMaterials = recoveredMaterials;
    if (processingNotes !== undefined) pickup.processingNotes = processingNotes;

    if (status === 'processing') {
      pickup.recyclerStatus = 'processing';
      pickup.status = 'recycling_in_progress';
    } else if (status === 'completed') {
      pickup.recyclerStatus = 'completed';
      pickup.status = 'completed';
      pickup.completedAt = new Date();

      // Award points to user if not already done
      const user = await User.findById(pickup.user);
      if (user) {
        user.points += 150;
        user.totalItemsRecycled += Number(pickup.quantity) || 1;
        user.co2Saved += 2.8;
        user.updateLevel();
        await user.save();
      }

      await Notification.create({
        user: pickup.user,
        title: 'Recycling Completed!',
        message: `Your e-waste was processed into recovered raw materials by ${req.user.companyName || req.user.name}. You earned 150 points!`,
        type: 'success',
        link: '/user/my-pickups',
      });
    }

    await pickup.save();

    res.status(200).json({
      success: true,
      message: status === 'completed' ? 'Recycling marked as completed!' : 'Operations updated.',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecyclerDashboard,
  getAssignedRequests,
  acceptAssignment,
  rejectAssignment,
  updateOperations,
};

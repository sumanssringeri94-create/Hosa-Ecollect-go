const Pickup = require('../models/Pickup');
const WasteItem = require('../models/WasteItem');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Schedule a pickup
// @route   POST /api/pickups
// @access  Private
const schedulePickup = async (req, res, next) => {
  try {
    const {
      address,
      city,
      pincode,
      scheduledDate,
      timeSlot,
      itemIds,
      category,
      deviceName,
      quantity = 1,
      weight,
      condition,
      image,
      notes,
    } = req.body;

    if (!address || !city || !scheduledDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Address, city, date, and time slot are required.',
      });
    }

    // Validate date is in future or today
    const date = new Date(scheduledDate);

    const pickup = await Pickup.create({
      user: req.user._id,
      items: itemIds || [],
      category: category || (itemIds && itemIds.length > 0 ? 'Mixed' : 'Electronics'),
      deviceName: deviceName || 'Electronic Devices',
      quantity: Number(quantity) || 1,
      weight: weight || '',
      condition: condition || 'Not Working',
      image: image || '',
      address: address.trim(),
      city: city.trim(),
      pincode: pincode || '',
      scheduledDate: date,
      timeSlot,
      status: 'pending',
      notes: notes || '',
    });

    // Update waste items status if provided
    if (itemIds && itemIds.length > 0) {
      await WasteItem.updateMany(
        { _id: { $in: itemIds }, user: req.user._id },
        { status: 'pickup_requested', pickup: pickup._id }
      );
    }

    // Create user notification
    await Notification.create({
      user: req.user._id,
      title: 'Pickup Request Submitted',
      message: `Your pickup request for ${deviceName || category || 'e-waste'} has been submitted and is pending verification.`,
      type: 'info',
      link: '/user/my-pickups',
    });

    const populated = await Pickup.findById(pickup._id)
      .populate('items', 'itemName category quantity pointsEarned')
      .populate('user', 'name email phone city');

    res.status(201).json({
      success: true,
      message: 'Pickup scheduled successfully! Request ID: #' + pickup._id.toString().slice(-6),
      pickup: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's pickups
// @route   GET /api/pickups/my
// @access  Private
const getMyPickups = async (req, res, next) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id })
      .populate('items', 'itemName category quantity pointsEarned')
      .populate('recycler', 'name companyName phone city')
      .populate('logisticsPartner', 'name companyName vehicleType phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: pickups.length, pickups });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pickup details
// @route   GET /api/pickups/:id
// @access  Private
const getPickupDetails = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id)
      .populate('user', 'name email phone city address')
      .populate('recycler', 'name companyName phone city wasteCategories')
      .populate('logisticsPartner', 'name companyName phone vehicleType serviceArea')
      .populate('items', 'itemName category quantity condition pointsEarned');

    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found.' });
    }

    // Role check: user must be owner or assigned partner or admin
    const userId = req.user._id.toString();
    const isOwner = pickup.user && (pickup.user._id || pickup.user).toString() === userId;
    const isRecycler = pickup.recycler && (pickup.recycler._id || pickup.recycler).toString() === userId;
    const isLogistics = pickup.logisticsPartner && (pickup.logisticsPartner._id || pickup.logisticsPartner).toString() === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isRecycler && !isLogistics && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this pickup.' });
    }

    res.status(200).json({ success: true, pickup });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a pickup
// @route   DELETE /api/pickups/:id
// @access  Private
const cancelPickup = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found.' });
    }

    if (pickup.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (['collected', 'recycling_in_progress', 'completed'].includes(pickup.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a pickup that has already been collected or processed.',
      });
    }

    await pickup.deleteOne();

    // Reset item status
    if (pickup.items && pickup.items.length > 0) {
      await WasteItem.updateMany(
        { _id: { $in: pickup.items } },
        { status: 'logged', pickup: null }
      );
    }

    res.status(200).json({ success: true, message: 'Pickup cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN ENDPOINTS ───────────────────────────────────

// @desc    Get all pickups (admin)
// @route   GET /api/pickups/admin/all
// @access  Admin
const getAllPickups = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    const pickups = await Pickup.find(filter)
      .populate('user', 'name email city phone')
      .populate('recycler', 'name companyName city phone')
      .populate('logisticsPartner', 'name companyName vehicleType phone')
      .populate('items', 'itemName category quantity')
      .sort({ createdAt: -1 });

    let filtered = pickups;
    if (search) {
      const q = search.toLowerCase();
      filtered = pickups.filter(p => {
        const uName = (p.user?.name || '').toLowerCase();
        const devName = (p.deviceName || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const pId = (p._id || '').toString();
        return uName.includes(q) || devName.includes(q) || cat.includes(q) || pId.includes(q);
      });
    }

    res.status(200).json({ success: true, count: filtered.length, pickups: filtered });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify a pickup (admin)
// @route   PUT /api/pickups/admin/:id/verify
// @access  Admin
const verifyPickup = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found.' });
    }

    pickup.status = 'verified';
    pickup.adminNote = req.body.adminNote || 'Request verified by Admin';
    await pickup.save();

    await Notification.create({
      user: pickup.user,
      title: 'Pickup Request Verified',
      message: 'Your e-waste collection request has been verified by our sustainability team.',
      type: 'success',
      link: '/user/track',
    });

    res.status(200).json({ success: true, message: 'Pickup verified successfully.', pickup });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign recycler to pickup (admin)
// @route   PUT /api/pickups/admin/:id/assign-recycler
// @access  Admin
const assignRecycler = async (req, res, next) => {
  try {
    const { recyclerId } = req.body;
    if (!recyclerId) {
      return res.status(400).json({ success: false, message: 'Recycler ID required.' });
    }

    const recycler = await User.findById(recyclerId);
    if (!recycler || recycler.role !== 'recycler') {
      return res.status(400).json({ success: false, message: 'Invalid recycler specified.' });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found.' });
    }

    pickup.recycler = recyclerId;
    pickup.recyclerStatus = 'pending';
    if (pickup.status === 'pending' || pickup.status === 'verified') {
      pickup.status = 'assigned';
    }
    await pickup.save();

    // Notify recycler
    await Notification.create({
      user: recyclerId,
      title: 'New Recycling Request Assigned',
      message: `You have been assigned pickup #${pickup._id.toString().slice(-6)} (${pickup.deviceName || pickup.category}).`,
      type: 'assignment',
      link: '/recycler/assigned',
    });

    // Notify user
    await Notification.create({
      user: pickup.user,
      title: 'Recycler Assigned',
      message: `${recycler.companyName || recycler.name} has been assigned to process your e-waste.`,
      type: 'info',
      link: '/user/track',
    });

    res.status(200).json({
      success: true,
      message: `Assigned recycler ${recycler.companyName || recycler.name} successfully.`,
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign logistics partner to pickup (admin)
// @route   PUT /api/pickups/admin/:id/assign-logistics
// @access  Admin
const assignLogistics = async (req, res, next) => {
  try {
    const { logisticsId, scheduledDate, timeSlot } = req.body;
    if (!logisticsId) {
      return res.status(400).json({ success: false, message: 'Logistics Partner ID required.' });
    }

    const partner = await User.findById(logisticsId);
    if (!partner || partner.role !== 'logistics') {
      return res.status(400).json({ success: false, message: 'Invalid logistics partner specified.' });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found.' });
    }

    pickup.logisticsPartner = logisticsId;
    pickup.logisticsStatus = 'pending';
    if (scheduledDate) pickup.scheduledDate = new Date(scheduledDate);
    if (timeSlot) pickup.timeSlot = timeSlot;
    pickup.status = 'pickup_scheduled';
    await pickup.save();

    // Notify logistics partner
    await Notification.create({
      user: logisticsId,
      title: 'New Pickup Assigned',
      message: `Pickup scheduled at ${pickup.address}, ${pickup.city}.`,
      type: 'assignment',
      link: '/logistics/pickups',
    });

    // Notify user
    await Notification.create({
      user: pickup.user,
      title: 'Collection Scheduled',
      message: `Logistics partner ${partner.companyName || partner.name} has scheduled your pickup for ${new Date(pickup.scheduledDate).toLocaleDateString()} (${pickup.timeSlot}).`,
      type: 'info',
      link: '/user/track',
    });

    res.status(200).json({
      success: true,
      message: `Assigned logistics partner ${partner.companyName || partner.name} successfully.`,
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pickup status manually (admin)
// @route   PUT /api/pickups/admin/:id/status
// @access  Admin
const updatePickupStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const validStatuses = [
      'pending',
      'verified',
      'assigned',
      'pickup_scheduled',
      'collected',
      'recycling_in_progress',
      'completed',
      'rejected',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found.' });
    }

    pickup.status = status;
    if (adminNote) pickup.adminNote = adminNote;
    if (status === 'completed' && !pickup.completedAt) {
      pickup.completedAt = new Date();
    }
    await pickup.save();

    // Notify user about status change
    await Notification.create({
      user: pickup.user,
      title: 'Pickup Status Updated',
      message: `Your pickup #${pickup._id.toString().slice(-6)} status is now: ${status.replace(/_/g, ' ').toUpperCase()}`,
      type: 'info',
      link: '/user/track',
    });

    res.status(200).json({ success: true, message: 'Pickup status updated successfully.', pickup });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a pickup (admin)
// @route   PUT /api/pickups/admin/:id/reject
// @access  Admin
const rejectPickup = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found.' });
    }

    pickup.status = 'rejected';
    pickup.adminNote = req.body.adminNote || 'Rejected by administrator';
    await pickup.save();

    // Reset items
    if (pickup.items && pickup.items.length > 0) {
      await WasteItem.updateMany(
        { _id: { $in: pickup.items } },
        { status: 'logged', pickup: null }
      );
    }

    await Notification.create({
      user: pickup.user,
      title: 'Pickup Request Rejected',
      message: `Your pickup request was not accepted. Reason: ${pickup.adminNote}`,
      type: 'warning',
      link: '/user/my-pickups',
    });

    res.status(200).json({ success: true, message: 'Pickup rejected.', pickup });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark pickup as completed (admin)
// @route   PUT /api/pickups/admin/:id/complete
// @access  Admin
const completePickup = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id).populate('items');
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found.' });
    }

    pickup.status = 'completed';
    pickup.recyclerStatus = 'completed';
    pickup.logisticsStatus = 'delivered';
    pickup.completedAt = new Date();

    let points = 100; // base reward
    if (pickup.items && pickup.items.length > 0) {
      points = pickup.items.reduce((acc, it) => acc + (it.pointsEarned || 50), 0);
    }
    pickup.pointsAwarded = points;
    await pickup.save();

    // Reward user
    const user = await User.findById(pickup.user);
    if (user) {
      user.points += points;
      user.totalItemsRecycled += Number(pickup.quantity) || 1;
      user.co2Saved += 2.5;
      user.updateLevel();
      await user.save();
    }

    await Notification.create({
      user: pickup.user,
      title: 'Recycling Completed!',
      message: `Your e-waste was successfully recycled! You earned ${points} green points.`,
      type: 'success',
      link: '/user/my-pickups',
    });

    res.status(200).json({ success: true, message: 'Pickup marked as completed.', pickup });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform-wide analytics (admin)
// @route   GET /api/pickups/admin/analytics
// @access  Admin
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRecyclers = await User.countDocuments({ role: 'recycler' });
    const totalLogistics = await User.countDocuments({ role: 'logistics' });
    const totalPickups = await Pickup.countDocuments();
    const pendingPickups = await Pickup.countDocuments({ status: 'pending' });
    const verifiedPickups = await Pickup.countDocuments({ status: 'verified' });
    const activeCollections = await Pickup.countDocuments({
      status: { $in: ['assigned', 'pickup_scheduled', 'collected', 'recycling_in_progress'] },
    });
    const completedPickups = await Pickup.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalRecyclers,
        totalLogistics,
        totalPickups,
        pendingPickups,
        verifiedPickups,
        activeCollections,
        completedPickups,
        totalPointsAwarded: 4500,
        totalCO2Saved: 1240.5,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  schedulePickup,
  getMyPickups,
  getPickupDetails,
  cancelPickup,
  getAllPickups,
  verifyPickup,
  assignRecycler,
  assignLogistics,
  updatePickupStatus,
  rejectPickup,
  completePickup,
  getAnalytics,
};

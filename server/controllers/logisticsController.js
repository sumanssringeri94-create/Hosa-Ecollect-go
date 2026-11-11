const Pickup = require('../models/Pickup');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get logistics dashboard stats
// @route   GET /api/logistics/dashboard
// @access  Logistics
const getLogisticsDashboard = async (req, res, next) => {
  try {
    const partnerId = req.user._id.toString();

    const allPickups = await Pickup.find({ logisticsPartner: partnerId });

    const today = new Date().toDateString();
    const todaysPickups = allPickups.filter(
      p => new Date(p.scheduledDate).toDateString() === today && p.status !== 'completed'
    ).length;

    const upcoming = allPickups.filter(
      p => new Date(p.scheduledDate) > new Date() && p.status !== 'completed'
    ).length;

    const completed = allPickups.filter(
      p => p.logisticsStatus === 'delivered' || p.status === 'completed'
    ).length;

    const pendingDeliveries = allPickups.filter(
      p => p.logisticsStatus === 'in_transit' || (p.status === 'collected' && p.logisticsStatus !== 'delivered')
    ).length;

    // Upcoming schedule (next 5 pickups)
    const schedule = await Pickup.find({ logisticsPartner: partnerId })
      .populate('user', 'name phone address city')
      .populate('recycler', 'name companyName phone address')
      .sort({ scheduledDate: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        todaysPickups,
        upcomingCollections: upcoming,
        completedPickups: completed,
        pendingDeliveries,
      },
      schedule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assigned pickups
// @route   GET /api/logistics/pickups
// @access  Logistics
const getAssignedPickups = async (req, res, next) => {
  try {
    const { status } = req.query;
    const partnerId = req.user._id.toString();

    let pickups = await Pickup.find({ logisticsPartner: partnerId })
      .populate('user', 'name email phone address city')
      .populate('recycler', 'name companyName phone companyAddress city')
      .sort({ scheduledDate: 1 });

    if (status && status !== 'all') {
      pickups = pickups.filter(p => p.logisticsStatus === status || p.status === status);
    }

    res.status(200).json({ success: true, count: pickups.length, pickups });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept pickup assignment
// @route   PUT /api/logistics/pickups/:id/accept
// @access  Logistics
const acceptPickup = async (req, res, next) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found' });
    }

    if (pickup.logisticsPartner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    pickup.logisticsStatus = 'accepted';
    await pickup.save();

    await Notification.create({
      user: pickup.user,
      title: 'Pickup Confirmed by Logistics',
      message: `${req.user.companyName || req.user.name} has confirmed your pickup schedule.`,
      type: 'info',
      link: '/user/track',
    });

    res.status(200).json({ success: true, message: 'Pickup assignment accepted.', pickup });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject pickup assignment
// @route   PUT /api/logistics/pickups/:id/reject
// @access  Logistics
const rejectPickup = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found' });
    }

    if (pickup.logisticsPartner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    pickup.logisticsPartner = null;
    pickup.logisticsStatus = 'rejected';
    pickup.pickupNotes = reason || 'Declined by logistics partner';
    pickup.status = 'assigned'; // Revert back to assigned (needs logistics)
    await pickup.save();

    res.status(200).json({
      success: true,
      message: 'Pickup rejected. Returned to admin pool for reassignment.',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update collection progress (collected from customer, en route)
// @route   PUT /api/logistics/pickups/:id/collected
// @access  Logistics
const markCollected = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found' });
    }

    if (pickup.logisticsPartner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    pickup.status = 'collected';
    pickup.logisticsStatus = 'in_transit';
    if (notes) pickup.pickupNotes = notes;
    await pickup.save();

    // Notify user
    await Notification.create({
      user: pickup.user,
      title: 'E-Waste Collected from Doorstep!',
      message: `Your e-waste was picked up and is in transit to the recycling facility.`,
      type: 'success',
      link: '/user/track',
    });

    // Notify recycler
    if (pickup.recycler) {
      await Notification.create({
        user: pickup.recycler,
        title: 'Incoming E-Waste in Transit',
        message: `${req.user.companyName || req.user.name} has collected pickup #${pickup._id.toString().slice(-6)} and is en route to your center.`,
        type: 'info',
        link: '/recycler/assigned',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Collection recorded. Status updated to Collected / In Transit.',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm delivery to recycling facility
// @route   PUT /api/logistics/pickups/:id/delivered
// @access  Logistics
const confirmDelivery = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup not found' });
    }

    if (pickup.logisticsPartner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this pickup' });
    }

    pickup.logisticsStatus = 'delivered';
    pickup.status = 'recycling_in_progress';
    if (notes) pickup.pickupNotes = (pickup.pickupNotes ? pickup.pickupNotes + ' | ' : '') + notes;
    await pickup.save();

    // Notify user
    await Notification.create({
      user: pickup.user,
      title: 'Delivered to Recycler',
      message: 'Your electronic waste has arrived safely at the recycling plant and will be processed soon.',
      type: 'info',
      link: '/user/track',
    });

    // Notify recycler
    if (pickup.recycler) {
      await Notification.create({
        user: pickup.recycler,
        title: 'E-Waste Delivered to Your Facility',
        message: `Pickup #${pickup._id.toString().slice(-6)} has arrived. Ready for weighing and processing.`,
        type: 'info',
        link: '/recycler/assigned',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Delivery confirmed to recycler facility.',
      pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logistics availability
// @route   PUT /api/logistics/availability
// @access  Logistics
const updateAvailability = async (req, res, next) => {
  try {
    const { availability, vehicleType, serviceArea } = req.body;
    const update = {};
    if (availability) update.availability = availability;
    if (vehicleType) update.vehicleType = vehicleType;
    if (serviceArea) update.serviceArea = serviceArea;

    const user = await User.findByIdAndUpdate(req.user._id, update);

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully.',
      availability: user.availability,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLogisticsDashboard,
  getAssignedPickups,
  acceptPickup,
  rejectPickup,
  markCollected,
  confirmDelivery,
  updateAvailability,
};

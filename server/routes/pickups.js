const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/pickupController');
const { protect, adminOnly } = require('../middleware/auth');

// Public/User pickup routes
router.post('/', protect, schedulePickup);
router.get('/my', protect, getMyPickups);
router.get('/:id', protect, getPickupDetails);
router.delete('/:id', protect, cancelPickup);

// Admin pickup management routes
router.get('/admin/all', protect, adminOnly, getAllPickups);
router.get('/admin/analytics', protect, adminOnly, getAnalytics);
router.put('/admin/:id/verify', protect, adminOnly, verifyPickup);
router.put('/admin/:id/assign-recycler', protect, adminOnly, assignRecycler);
router.put('/admin/:id/assign-logistics', protect, adminOnly, assignLogistics);
router.put('/admin/:id/status', protect, adminOnly, updatePickupStatus);
router.put('/admin/:id/reject', protect, adminOnly, rejectPickup);
router.put('/admin/:id/complete', protect, adminOnly, completePickup);

module.exports = router;

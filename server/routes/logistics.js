const express = require('express');
const router = express.Router();
const {
  getLogisticsDashboard,
  getAssignedPickups,
  acceptPickup,
  rejectPickup,
  markCollected,
  confirmDelivery,
  updateAvailability,
} = require('../controllers/logisticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('logistics', 'admin'));

router.get('/dashboard', getLogisticsDashboard);
router.get('/pickups', getAssignedPickups);
router.put('/pickups/:id/accept', acceptPickup);
router.put('/pickups/:id/reject', rejectPickup);
router.put('/pickups/:id/collected', markCollected);
router.put('/pickups/:id/delivered', confirmDelivery);
router.put('/availability', updateAvailability);

module.exports = router;

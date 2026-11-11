const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllUsers,
  updateUserStatus,
  getRecyclers,
  verifyRecycler,
  getLogisticsPartners,
  getReports,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/recyclers', getRecyclers);
router.put('/recyclers/:id/verify', verifyRecycler);
router.get('/logistics', getLogisticsPartners);
router.get('/reports', getReports);

module.exports = router;

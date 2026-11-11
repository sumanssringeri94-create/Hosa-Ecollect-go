const express = require('express');
const router = express.Router();
const {
  getRecyclerDashboard,
  getAssignedRequests,
  acceptAssignment,
  rejectAssignment,
  updateOperations,
} = require('../controllers/recyclerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('recycler', 'admin'));

router.get('/dashboard', getRecyclerDashboard);
router.get('/assigned', getAssignedRequests);
router.put('/pickups/:id/accept', acceptAssignment);
router.put('/pickups/:id/reject', rejectAssignment);
router.put('/pickups/:id/operations', updateOperations);

module.exports = router;

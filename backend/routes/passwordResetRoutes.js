const express = require('express');
const {
  createResetRequest,
  getResetRequests,
  approveResetRequest,
  rejectResetRequest,
  checkResetStatus,
  completePasswordReset
} = require('../controllers/passwordResetController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

// Public Workflow Routes
router.post('/', createResetRequest);
router.get('/check/:employeeId', checkResetStatus);
router.post('/complete', completePasswordReset);

// Admin Approval Routes
router.get('/', protect, adminOnly, getResetRequests);
router.put('/:id/approve', protect, adminOnly, approveResetRequest);
router.put('/:id/reject', protect, adminOnly, rejectResetRequest);

module.exports = router;

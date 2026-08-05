const express = require('express');
const {
  getDashboardStats,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  resetEmployeePassword,
  getPasswordAudits
} = require('../controllers/adminController');

const {
  getAllLeaveRequests,
  approveLeave,
  rejectLeave
} = require('../controllers/leaveController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/leaves', getAllLeaveRequests);
router.put('/approve/:id', approveLeave);
router.put('/reject/:id', rejectLeave);

// Employee Management Routes
router.get('/employees', getAllEmployees);
router.post('/employees', createEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);
router.put('/employees/:id/status', toggleEmployeeStatus);
router.put('/employees/:id/reset-password', resetEmployeePassword);

// Audit Log Routes
router.get('/password-audits', getPasswordAudits);

module.exports = router;

const express = require('express');
const {
  getAdminDashboard,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  toggleEmployeeStatus,
  resetEmployeePassword,
  getPasswordAudits
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/leaves', getAllLeaves);
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

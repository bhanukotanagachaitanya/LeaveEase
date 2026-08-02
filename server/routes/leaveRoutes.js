const express = require('express');
const { body } = require('express-validator');
const { applyLeave, getLeaveHistory, cancelLeave } = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('leaveType')
      .isIn(['Casual Leave', 'Sick Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'])
      .withMessage('Valid leave type is required'),
    body('fromDate').isISO8601().withMessage('Valid start date (ISO8601) is required'),
    body('toDate').isISO8601().withMessage('Valid end date (ISO8601) is required'),
    body('reason').isLength({ min: 5 }).withMessage('Reason must be at least 5 characters long'),
    validate
  ],
  applyLeave
);

router.get('/history', protect, getLeaveHistory);
router.delete('/:id', protect, cancelLeave);

module.exports = router;

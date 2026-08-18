const express = require('express');
const {
  createHoliday,
  getHolidays,
  updateHoliday,
  deleteHoliday
} = require('../controllers/holidayController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getHolidays);
router.get('/public', getHolidays);

router.post('/', protect, adminOnly, createHoliday);
router.put('/:id', protect, adminOnly, updateHoliday);
router.delete('/:id', protect, adminOnly, deleteHoliday);

module.exports = router;

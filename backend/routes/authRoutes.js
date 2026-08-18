const express = require('express');
const { body } = require('express-validator');
const {
  checkSetupStatus,
  setupFirstAdmin,
  register,
  login,
  logout,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/setup-status', checkSetupStatus);
router.post('/setup-admin', setupFirstAdmin);

router.post('/register', register);

router.post(
  '/login',
  [
    body('identifier').notEmpty().withMessage('Employee ID, Name, or Admin ID is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;

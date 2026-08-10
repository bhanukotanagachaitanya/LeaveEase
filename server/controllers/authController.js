const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 Minutes lockout

/**
 * @desc    Check system setup status (Direct login mode enabled - no one-time setup required)
 * @route   GET /api/auth/setup-status
 * @access  Public
 */
const checkSetupStatus = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'System ready for login', {
      setupNeeded: false,
      initialized: true
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    First-Time Administrator Setup - Disabled in Direct Login Mode
 * @route   POST /api/auth/setup-admin
 * @access  Public
 */
const setupFirstAdmin = async (req, res, next) => {
  try {
    return errorResponse(res, 400, 'Direct login mode active. Please log in using your Administrator credentials.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Public Registration - DISABLED (Employee creation is Admin only)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  return errorResponse(
    res,
    403,
    'Public employee registration is disabled. Employee accounts are created exclusively by the Administrator.'
  );
};

/**
 * @desc    Authenticate user via Employee ID, Email, or Name & Password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return errorResponse(res, 400, 'Please enter Employee ID / Email / Name and Password');
    }

    const trimmedIdentifier = identifier.trim();

    // Flexible identifier search matching employeeId, email, or name
    const query = {
      $or: [
        { employeeId: trimmedIdentifier.toUpperCase() },
        { email: trimmedIdentifier.toLowerCase() },
        { name: { $regex: `^${trimmedIdentifier}$`, $options: 'i' } }
      ]
    };

    const user = await User.findOne(query);

    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials. Please check your ID/Email and password.');
    }

    // Check Account Lockout status
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesRemaining = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      return errorResponse(
        res,
        423,
        `Account locked due to multiple failed login attempts. Try again in ${minutesRemaining} minute(s).`
      );
    }

    // Check Activation Status
    if (user.isActive === false) {
      return errorResponse(
        res,
        403,
        'Your account has been deactivated. Please contact your Administrator.'
      );
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        user.failedLoginAttempts = 0;
        await user.save();
        return errorResponse(
          res,
          423,
          `Account locked after ${MAX_FAILED_ATTEMPTS} failed attempts. Lock duration: 15 minutes.`
        );
      }
      await user.save();
      const remaining = MAX_FAILED_ATTEMPTS - user.failedLoginAttempts;
      return errorResponse(
        res,
        401,
        `Invalid password. ${remaining} attempt(s) remaining before account lockout.`
      );
    }

    // Reset failed login counters on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = generateToken(user._id, user.role);

    return successResponse(res, 200, 'Login successful', {
      user: {
        _id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        email: user.email,
        department: user.department,
        role: user.role,
        isActive: user.isActive
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  return successResponse(res, 200, 'Successfully logged out');
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  return successResponse(res, 200, 'User details retrieved', { user: req.user });
};

module.exports = {
  checkSetupStatus,
  setupFirstAdmin,
  register,
  login,
  logout,
  getMe
};

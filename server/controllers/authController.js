const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/responseHandler');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 Minutes lockout

/**
 * @desc    Check if an administrator account needs setup
 * @route   GET /api/auth/setup-status
 * @access  Public
 */
const checkSetupStatus = async (req, res, next) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    const defaultAdmin = await User.findOne({ role: 'admin', email: 'admin@company.com' });

    // Setup is needed if no admin exists, OR if only the default seed admin exists
    const setupNeeded = adminCount === 0 || !!defaultAdmin;

    return successResponse(res, 200, 'Setup status checked', {
      setupNeeded,
      initialized: !setupNeeded
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    First-Time Administrator Setup (Configures Primary Administrator)
 * @route   POST /api/auth/setup-admin
 * @access  Public
 */
const setupFirstAdmin = async (req, res, next) => {
  try {
    const { name, employeeId, email, password, confirmPassword, department } = req.body;
    if (!name || !employeeId || !email || !password) {
      return errorResponse(res, 400, 'Please provide all required Administrator details');
    }

    if (confirmPassword && password !== confirmPassword) {
      return errorResponse(res, 400, 'Password and Password Confirmation do not match');
    }

    if (password.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters long');
    }

    const trimmedEmpId = employeeId.trim().toUpperCase();
    const trimmedEmail = email.trim().toLowerCase();

    // Check if an existing primary admin exists (including default seed admin)
    let admin = await User.findOne({
      $or: [
        { role: 'admin' },
        { employeeId: trimmedEmpId },
        { email: trimmedEmail }
      ]
    });

    if (admin) {
      // Update existing primary admin account
      admin.name = name.trim();
      admin.employeeId = trimmedEmpId;
      admin.email = trimmedEmail;
      admin.password = password;
      admin.department = department || 'Human Resources';
      admin.role = 'admin';
      admin.isActive = true;
      await admin.save();
    } else {
      // Create new primary admin account
      admin = await User.create({
        name: name.trim(),
        employeeId: trimmedEmpId,
        email: trimmedEmail,
        password,
        department: department || 'Human Resources',
        role: 'admin',
        isActive: true
      });
    }

    const token = generateToken(admin._id, admin.role);

    return successResponse(res, 201, 'Primary Administrator configured successfully!', {
      user: {
        _id: admin._id,
        name: admin.name,
        employeeId: admin.employeeId,
        email: admin.email,
        department: admin.department,
        role: admin.role
      },
      token
    });
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 400, 'An account with this Administrator ID or Email address already exists.');
    }
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
 * @desc    Authenticate user via Employee ID or Employee Name & password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { identifier, password, role } = req.body;

    if (!identifier || !password) {
      return errorResponse(res, 400, 'Please enter Employee ID / Name and Password');
    }

    const trimmedIdentifier = identifier.trim();

    const query = {
      $or: [
        { employeeId: trimmedIdentifier.toUpperCase() },
        { name: { $regex: `^${trimmedIdentifier}$`, $options: 'i' } },
        { email: trimmedIdentifier.toLowerCase() }
      ]
    };

    if (role) {
      query.role = role;
    }

    const user = await User.findOne(query);

    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
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

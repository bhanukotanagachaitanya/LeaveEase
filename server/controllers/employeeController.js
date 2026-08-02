const User = require('../models/User');
const PasswordAudit = require('../models/PasswordAudit');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * @desc    Get current employee profile
 * @route   GET /api/employee/profile
 * @access  Private (Employee / Admin)
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return errorResponse(res, 404, 'Employee profile not found');
    }
    return successResponse(res, 200, 'Profile fetched successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee profile & password
 * @route   PUT /api/employee/profile
 * @access  Private (Employee / Admin)
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, department, email, currentPassword, newPassword, securityQuestion, securityAnswer } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    if (name) user.name = name;
    if (department) user.department = department;
    if (securityQuestion) user.securityQuestion = securityQuestion;
    if (securityAnswer) user.securityAnswer = securityAnswer;

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return errorResponse(res, 400, 'This email address is already in use by another account');
      }
      user.email = email.toLowerCase();
    }

    // Password change verification
    if (newPassword) {
      if (!currentPassword) {
        return errorResponse(res, 400, 'Please provide your current password to update password');
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return errorResponse(res, 400, 'Current password is incorrect');
      }
      if (newPassword.length < 6) {
        return errorResponse(res, 400, 'New password must be at least 6 characters long');
      }
      user.password = newPassword;

      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

      // Log Password Change Audit
      await PasswordAudit.create({
        userId: user._id,
        employeeName: user.name,
        employeeId: user.employeeId,
        ipAddress: Array.isArray(clientIp) ? clientIp[0] : clientIp,
        changedBy: 'Self',
        status: 'Success'
      });

      // Notify Admins
      const admins = await User.find({ role: 'admin' });
      await Promise.all(
        admins.map((adm) =>
          Notification.create({
            userId: adm._id,
            title: 'Password Changed (Self)',
            message: `Employee ${user.name} (${user.employeeId}) updated their account password.`,
            type: 'Password'
          })
        )
      );
    }

    await user.save();

    return successResponse(res, 200, 'Profile updated successfully', {
      user: {
        _id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        email: user.email,
        department: user.department,
        role: user.role,
        isActive: user.isActive,
        securityQuestion: user.securityQuestion,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};

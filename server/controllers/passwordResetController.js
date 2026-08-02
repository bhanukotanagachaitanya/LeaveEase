const PasswordResetRequest = require('../models/PasswordResetRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');
const PasswordAudit = require('../models/PasswordAudit');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * @desc    Submit a Password Reset Request (Employee workflow)
 * @route   POST /api/password-resets
 * @access  Public
 */
const createResetRequest = async (req, res, next) => {
  try {
    const { employeeId, email, reason } = req.body;

    if (!employeeId || !email || !reason) {
      return errorResponse(res, 400, 'Employee ID, registered Email, and Reason are required');
    }

    const user = await User.findOne({ employeeId: employeeId.trim().toUpperCase() });
    if (!user) {
      return errorResponse(res, 404, 'No employee account found matching this Employee ID');
    }

    if (user.email.toLowerCase() !== email.trim().toLowerCase()) {
      return errorResponse(res, 400, 'The provided email address does not match employee records');
    }

    // Check for existing pending request
    const existingPending = await PasswordResetRequest.findOne({
      employeeId: user.employeeId,
      status: 'Pending'
    });

    if (existingPending) {
      return errorResponse(
        res,
        400,
        'You already have a pending password reset request awaiting Administrator approval.'
      );
    }

    const resetRequest = await PasswordResetRequest.create({
      employeeId: user.employeeId,
      employeeName: user.name,
      email: user.email,
      reason,
      status: 'Pending'
    });

    // Notify all Administrators
    const admins = await User.find({ role: 'admin' });
    await Promise.all(
      admins.map((adm) =>
        Notification.create({
          userId: adm._id,
          title: 'New Password Reset Request',
          message: `Employee ${user.name} (${user.employeeId}) requested a password reset. Reason: "${reason}"`,
          type: 'Password'
        })
      )
    );

    return successResponse(
      res,
      201,
      'Password reset request submitted successfully! An Administrator will review your request.',
      { resetRequest }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all password reset requests (Admin feature)
 * @route   GET /api/password-resets
 * @access  Private (Admin)
 */
const getResetRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [requests, totalCount] = await Promise.all([
      PasswordResetRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('approvedBy', 'name'),
      PasswordResetRequest.countDocuments(query)
    ]);

    return successResponse(res, 200, 'Password reset requests fetched', {
      requests,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve a Password Reset Request (Admin feature)
 * @route   PUT /api/password-resets/:id/approve
 * @access  Private (Admin)
 */
const approveResetRequest = async (req, res, next) => {
  try {
    const { adminRemarks } = req.body;
    const request = await PasswordResetRequest.findById(req.params.id);

    if (!request) {
      return errorResponse(res, 404, 'Password reset request not found');
    }

    request.status = 'Approved';
    request.approvedBy = req.user._id;
    request.approvedDate = new Date();
    if (adminRemarks) request.adminRemarks = adminRemarks;
    await request.save();

    const user = await User.findOne({ employeeId: request.employeeId });
    if (user) {
      await Notification.create({
        userId: user._id,
        title: 'Password Reset Request Approved',
        message:
          'Your password reset request has been approved by Administrator. You may now create your new password.',
        type: 'Password'
      });
    }

    return successResponse(res, 200, 'Password reset request approved', { request });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject a Password Reset Request (Admin feature)
 * @route   PUT /api/password-resets/:id/reject
 * @access  Private (Admin)
 */
const rejectResetRequest = async (req, res, next) => {
  try {
    const { adminRemarks } = req.body;
    const request = await PasswordResetRequest.findById(req.params.id);

    if (!request) {
      return errorResponse(res, 404, 'Password reset request not found');
    }

    request.status = 'Rejected';
    request.approvedBy = req.user._id;
    request.approvedDate = new Date();
    if (adminRemarks) request.adminRemarks = adminRemarks;
    await request.save();

    const user = await User.findOne({ employeeId: request.employeeId });
    if (user) {
      await Notification.create({
        userId: user._id,
        title: 'Password Reset Request Rejected',
        message: `Your password reset request was rejected. ${adminRemarks ? `Remarks: ${adminRemarks}` : ''}`,
        type: 'Password'
      });
    }

    return successResponse(res, 200, 'Password reset request rejected', { request });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if an approved password reset permission exists
 * @route   GET /api/password-resets/check/:employeeId
 * @access  Public
 */
const checkResetStatus = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const request = await PasswordResetRequest.findOne({
      employeeId: employeeId.trim().toUpperCase(),
      status: 'Approved'
    }).sort({ createdAt: -1 });

    if (!request) {
      return errorResponse(
        res,
        400,
        'No approved password reset request found. Please submit a request or contact Administrator.'
      );
    }

    return successResponse(res, 200, 'Approved reset request found', { request });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Complete Password Reset upon Admin Approval
 * @route   POST /api/password-resets/complete
 * @access  Public
 */
const completePasswordReset = async (req, res, next) => {
  try {
    const { employeeId, newPassword } = req.body;

    if (!employeeId || !newPassword) {
      return errorResponse(res, 400, 'Employee ID and new password are required');
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 400, 'New password must be at least 6 characters long');
    }

    const resetReq = await PasswordResetRequest.findOne({
      employeeId: employeeId.trim().toUpperCase(),
      status: 'Approved'
    });

    if (!resetReq) {
      return errorResponse(
        res,
        403,
        'Unauthorized: No approved password reset request found for this Employee ID.'
      );
    }

    const user = await User.findOne({ employeeId: resetReq.employeeId });
    if (!user) {
      return errorResponse(res, 404, 'Employee record not found');
    }

    user.password = newPassword;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    resetReq.status = 'Completed';
    await resetReq.save();

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    // Log Password Change Audit (security rule: NEVER store plain passwords)
    await PasswordAudit.create({
      userId: user._id,
      employeeName: user.name,
      employeeId: user.employeeId,
      ipAddress: Array.isArray(clientIp) ? clientIp[0] : clientIp,
      changedBy: 'Self',
      status: 'Success'
    });

    return successResponse(res, 200, 'Password updated successfully! You can now log in.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResetRequest,
  getResetRequests,
  approveResetRequest,
  rejectResetRequest,
  checkResetStatus,
  completePasswordReset
};

const LeaveRequest = require('../models/LeaveRequest');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Helper to calculate total calendar days between two dates inclusive
 */
const calculateDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

/**
 * @desc    Apply for leave
 * @route   POST /api/leave
 * @access  Private (Employee)
 */
const applyLeave = async (req, res, next) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return errorResponse(res, 400, 'Please provide all required fields: leaveType, fromDate, toDate, and reason');
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return errorResponse(res, 400, 'Invalid date format provided');
    }

    // Set time to start of day for date comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDay = new Date(start);
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    if (startDay < today) {
      return errorResponse(res, 400, 'Leave start date (From Date) cannot be in the past');
    }

    if (endDay < startDay) {
      return errorResponse(res, 400, 'End date (To Date) cannot be before start date (From Date)');
    }

    const totalDays = calculateDays(startDay, endDay);

    // Create leave request
    const leaveRequest = await LeaveRequest.create({
      employeeId: req.user._id,
      leaveType,
      fromDate: startDay,
      toDate: endDay,
      totalDays,
      reason,
      status: 'Pending'
    });

    const populatedLeave = await LeaveRequest.findById(leaveRequest._id).populate(
      'employeeId',
      'name employeeId email department'
    );

    return successResponse(res, 201, 'Leave application submitted successfully', {
      leaveRequest: populatedLeave
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get leave history and dashboard statistics for logged-in employee
 * @route   GET /api/leave/history
 * @access  Private (Employee)
 */
const getLeaveHistory = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = { employeeId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { leaveType: { $regex: search, $options: 'i' } },
        { reason: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leaveRequests, totalCount] = await Promise.all([
      LeaveRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('employeeId', 'name employeeId email department'),
      LeaveRequest.countDocuments(query)
    ]);

    // Calculate aggregated metrics for employee dashboard
    const allUserLeaves = await LeaveRequest.find({ employeeId: req.user._id });
    const stats = {
      totalRequests: allUserLeaves.length,
      pendingRequests: allUserLeaves.filter(l => l.status === 'Pending').length,
      approvedLeaves: allUserLeaves.filter(l => l.status === 'Approved').length,
      rejectedLeaves: allUserLeaves.filter(l => l.status === 'Rejected').length,
      cancelledLeaves: allUserLeaves.filter(l => l.status === 'Cancelled').length
    };

    return successResponse(res, 200, 'Leave history fetched successfully', {
      stats,
      leaveRequests,
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
 * @desc    Cancel a pending leave request
 * @route   DELETE /api/leave/:id
 * @access  Private (Employee)
 */
const cancelLeave = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return errorResponse(res, 404, 'Leave request not found');
    }

    // Verify ownership
    if (leave.employeeId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: You can only cancel your own leave requests');
    }

    if (leave.status !== 'Pending') {
      return errorResponse(res, 400, `Cannot cancel a leave request that is already ${leave.status.toLowerCase()}`);
    }

    leave.status = 'Cancelled';
    await leave.save();

    return successResponse(res, 200, 'Leave request cancelled successfully', { leave });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyLeave,
  getLeaveHistory,
  cancelLeave
};

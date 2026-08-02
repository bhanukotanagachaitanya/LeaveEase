const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const PasswordAudit = require('../models/PasswordAudit');
const Notification = require('../models/Notification');
const Holiday = require('../models/Holiday');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * @desc    Get Admin Dashboard metrics and analytics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      totalLeaveRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      recentRequests,
      upcomingHolidays,
      recentPasswordAudits,
      recentNotifications
    ] = await Promise.all([
      User.countDocuments({ role: 'employee' }),
      User.countDocuments({ role: 'employee', isActive: true }),
      LeaveRequest.countDocuments(),
      LeaveRequest.countDocuments({ status: 'Pending' }),
      LeaveRequest.countDocuments({ status: 'Approved' }),
      LeaveRequest.countDocuments({ status: 'Rejected' }),
      LeaveRequest.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('employeeId', 'name employeeId department email'),
      Holiday.find({ date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } })
        .sort({ date: 1 })
        .limit(5),
      PasswordAudit.find().sort({ createdAt: -1 }).limit(5),
      Notification.find({ $or: [{ userId: req.user._id }, { userId: null }] })
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    // Aggregate leave requests by type
    const leavesByType = await LeaveRequest.aggregate([
      { $group: { _id: '$leaveType', count: { $sum: 1 } } }
    ]);

    // Aggregate leave requests by status
    const leavesByStatus = await LeaveRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return successResponse(res, 200, 'Admin dashboard analytics retrieved', {
      metrics: {
        totalEmployees,
        activeEmployees,
        totalLeaveRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests
      },
      analytics: {
        leavesByType,
        leavesByStatus
      },
      recentRequests,
      upcomingHolidays,
      recentPasswordAudits,
      recentNotifications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all leave requests with filters & pagination
 * @route   GET /api/admin/leaves
 * @access  Private (Admin)
 */
const getAllLeaves = async (req, res, next) => {
  try {
    const { status, leaveType, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (leaveType && leaveType !== 'All') {
      query.leaveType = leaveType;
    }

    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { employeeId: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = matchingUsers.map(u => u._id);

      query.$or = [
        { employeeId: { $in: userIds } },
        { reason: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [leaves, totalCount] = await Promise.all([
      LeaveRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('employeeId', 'name employeeId email department role'),
      LeaveRequest.countDocuments(query)
    ]);

    return successResponse(res, 200, 'Leave requests retrieved successfully', {
      leaves,
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
 * @desc    Approve a leave request
 * @route   PUT /api/admin/approve/:id
 * @access  Private (Admin)
 */
const approveLeave = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const leave = await LeaveRequest.findById(req.params.id).populate(
      'employeeId',
      'name employeeId email department'
    );

    if (!leave) {
      return errorResponse(res, 404, 'Leave request not found');
    }

    leave.status = 'Approved';
    if (remarks !== undefined) {
      leave.remarks = remarks;
    }
    await leave.save();

    // Create Notification for Employee
    await Notification.create({
      userId: leave.employeeId._id,
      title: 'Leave Request Approved',
      message: `Your ${leave.leaveType} request for ${leave.totalDays} day(s) has been approved by Admin.`,
      type: 'Leave'
    });

    return successResponse(res, 200, 'Leave request approved successfully', { leave });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject a leave request
 * @route   PUT /api/admin/reject/:id
 * @access  Private (Admin)
 */
const rejectLeave = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const leave = await LeaveRequest.findById(req.params.id).populate(
      'employeeId',
      'name employeeId email department'
    );

    if (!leave) {
      return errorResponse(res, 404, 'Leave request not found');
    }

    leave.status = 'Rejected';
    if (remarks !== undefined) {
      leave.remarks = remarks;
    }
    await leave.save();

    // Create Notification for Employee
    await Notification.create({
      userId: leave.employeeId._id,
      title: 'Leave Request Rejected',
      message: `Your ${leave.leaveType} request was rejected by Admin. ${remarks ? `Remarks: ${remarks}` : ''}`,
      type: 'Leave'
    });

    return successResponse(res, 200, 'Leave request rejected successfully', { leave });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employees with filters & search
 * @route   GET /api/admin/employees
 * @access  Private (Admin)
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const { search, department, status, page = 1, limit = 10 } = req.query;

    const query = { role: 'employee' };

    if (department && department !== 'All') {
      query.department = department;
    }

    if (status && status !== 'All') {
      query.isActive = status === 'Active';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [employees, totalCount] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    const employeesWithStats = await Promise.all(
      employees.map(async emp => {
        const empLeaves = await LeaveRequest.find({ employeeId: emp._id });
        return {
          ...emp.toObject(),
          stats: {
            totalLeaves: empLeaves.length,
            approvedLeaves: empLeaves.filter(l => l.status === 'Approved').length,
            pendingLeaves: empLeaves.filter(l => l.status === 'Pending').length,
            rejectedLeaves: empLeaves.filter(l => l.status === 'Rejected').length
          }
        };
      })
    );

    return successResponse(res, 200, 'Employees retrieved successfully', {
      employees: employeesWithStats,
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
 * @desc    Create a new employee account (Admin feature)
 * @route   POST /api/admin/employees
 * @access  Private (Admin)
 */
const createEmployee = async (req, res, next) => {
  try {
    const { name, employeeId, email, password, department, securityQuestion, securityAnswer } = req.body;

    if (!name || !employeeId || !email || !password || !department) {
      return errorResponse(res, 400, 'Please fill in all required employee fields');
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { employeeId: employeeId.toUpperCase() }]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return errorResponse(res, 400, 'An employee with this email address already exists');
      }
      if (existingUser.employeeId === employeeId.toUpperCase()) {
        return errorResponse(res, 400, 'An employee with this Employee ID already exists');
      }
    }

    const employee = await User.create({
      name,
      employeeId: employeeId.toUpperCase(),
      email: email.toLowerCase(),
      password,
      department,
      role: 'employee',
      isActive: true,
      securityQuestion: securityQuestion || 'What is your employee initial security PIN?',
      securityAnswer: (securityAnswer || '1234').toLowerCase()
    });

    // Create Notification
    await Notification.create({
      userId: employee._id,
      title: 'Welcome to LeaveEase',
      message: `Your employee account (${employee.employeeId}) has been created by Administrator.`,
      type: 'Employee'
    });

    return successResponse(res, 201, 'Employee account created successfully', { employee });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee account details
 * @route   PUT /api/admin/employees/:id
 * @access  Private (Admin)
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { name, department, email } = req.body;
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return errorResponse(res, 404, 'Employee not found');
    }

    if (name) employee.name = name;
    if (department) employee.department = department;
    if (email && email.toLowerCase() !== employee.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists && emailExists._id.toString() !== employee._id.toString()) {
        return errorResponse(res, 400, 'Email address is already in use');
      }
      employee.email = email.toLowerCase();
    }

    await employee.save();

    return successResponse(res, 200, 'Employee updated successfully', { employee });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete employee account
 * @route   DELETE /api/admin/employees/:id
 * @access  Private (Admin)
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return errorResponse(res, 404, 'Employee not found');
    }

    if (employee.role === 'admin') {
      return errorResponse(res, 400, 'Cannot delete Administrator account');
    }

    await User.findByIdAndDelete(req.params.id);
    await LeaveRequest.deleteMany({ employeeId: req.params.id });

    return successResponse(res, 200, 'Employee account deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle employee active/inactive status
 * @route   PUT /api/admin/employees/:id/status
 * @access  Private (Admin)
 */
const toggleEmployeeStatus = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return errorResponse(res, 404, 'Employee not found');
    }

    employee.isActive = !employee.isActive;
    await employee.save();

    return successResponse(
      res,
      200,
      `Employee account ${employee.isActive ? 'activated' : 'deactivated'} successfully`,
      { employee }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin reset employee password
 * @route   PUT /api/admin/employees/:id/reset-password
 * @access  Private (Admin)
 */
const resetEmployeePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return errorResponse(res, 400, 'New password must be at least 6 characters long');
    }

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return errorResponse(res, 404, 'Employee not found');
    }

    employee.password = newPassword;
    await employee.save();

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    // Log Password Change Audit (security rule: NEVER store unhashed or plain passwords)
    await PasswordAudit.create({
      userId: employee._id,
      employeeName: employee.name,
      employeeId: employee.employeeId,
      ipAddress: Array.isArray(clientIp) ? clientIp[0] : clientIp,
      changedBy: 'Admin',
      status: 'Success'
    });

    // Notify Employee
    await Notification.create({
      userId: employee._id,
      title: 'Password Reset by Admin',
      message: 'Your account password was reset by an Administrator. Please update your password upon sign-in.',
      type: 'Password'
    });

    return successResponse(res, 200, `Password for ${employee.name} reset successfully`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get password change audit history logs
 * @route   GET /api/admin/password-audits
 * @access  Private (Admin)
 */
const getPasswordAudits = async (req, res, next) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [audits, total] = await Promise.all([
      PasswordAudit.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      PasswordAudit.countDocuments()
    ]);

    return successResponse(res, 200, 'Password audit logs retrieved', {
      audits,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

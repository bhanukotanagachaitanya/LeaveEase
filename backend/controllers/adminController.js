const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const PasswordAudit = require('../models/PasswordAudit');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * @desc    Get Admin Dashboard Statistics & Recent Activity
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      totalLeaveRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      recentRequests,
      recentPasswordAudits,
      leavesByType
    ] = await Promise.all([
      User.countDocuments({ role: 'employee' }),
      User.countDocuments({ role: 'employee', isActive: true }),
      LeaveRequest.countDocuments(),
      LeaveRequest.countDocuments({ status: 'Pending' }),
      LeaveRequest.countDocuments({ status: 'Approved' }),
      LeaveRequest.countDocuments({ status: 'Rejected' }),
      LeaveRequest.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('employeeId', 'name employeeId department email'),
      PasswordAudit.find().sort({ createdAt: -1 }).limit(5),
      LeaveRequest.aggregate([
        { $group: { _id: '$leaveType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    return successResponse(res, 200, 'Admin dashboard analytics fetched', {
      metrics: {
        totalEmployees,
        activeEmployees,
        totalLeaveRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests
      },
      recentRequests,
      recentPasswordAudits,
      analytics: {
        leavesByType
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employees with pagination, search, and password visibility
 * @route   GET /api/admin/employees
 * @access  Private (Admin)
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const { search = '', department = 'All', status = 'All', page = 1, limit = 10 } = req.query;

    let query = { role: 'employee' };

    if (department && department !== 'All') {
      query.department = department;
    }

    if (status && status !== 'All') {
      query.isActive = status === 'Active';
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { employeeId: searchRegex },
        { email: searchRegex },
        { department: searchRegex }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [employees, totalCount] = await Promise.all([
      User.find(query)
        .select('+initialPassword')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);

    return successResponse(res, 200, 'Employee directory fetched', {
      employees,
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
    const { name, employeeId, email, password, department, role = 'employee' } = req.body;

    if (!name || !employeeId || !email || !password || !department) {
      return errorResponse(res, 400, 'All fields are required');
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { employeeId: employeeId.toUpperCase() }]
    });

    if (existingUser) {
      return errorResponse(
        res,
        400,
        'Employee already exists with this Employee ID or Email address!'
      );
    }

    const newEmployee = await User.create({
      name,
      employeeId: employeeId.toUpperCase(),
      email: email.toLowerCase(),
      password,
      department,
      role,
      isActive: true
    });

    await Notification.create({
      userId: newEmployee._id,
      title: 'Welcome to LeaveEase!',
      message: `Your employee account (${newEmployee.employeeId}) has been initialized by HR Administrator.`,
      type: 'Account'
    });

    return successResponse(res, 201, 'Employee created successfully!', {
      employee: newEmployee
    });
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Employee already exists with this Employee ID or Email address!');
    }
    next(error);
  }
};

/**
 * @desc    Update employee details
 * @route   PUT /api/admin/employees/:id
 * @access  Private (Admin)
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { name, email, department, role, isActive } = req.body;
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return errorResponse(res, 404, 'Employee record not found');
    }

    let changed = false;
    if (name && name !== employee.name) {
      employee.name = name;
      changed = true;
    }
    if (email && email.toLowerCase() !== employee.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists && emailExists._id.toString() !== employee._id.toString()) {
        return errorResponse(res, 400, 'Email address is already in use by another user');
      }
      employee.email = email.toLowerCase();
      changed = true;
    }
    if (department) employee.department = department;
    if (role) employee.role = role;
    if (typeof isActive === 'boolean') employee.isActive = isActive;

    await employee.save();

    return successResponse(res, 200, 'Employee updated successfully', { employee });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle employee active/inactive status
 * @route   PATCH /api/admin/employees/:id/toggle-status
 * @access  Private (Admin)
 */
const toggleEmployeeStatus = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return errorResponse(res, 404, 'Employee record not found');
    }

    if (employee._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 400, 'You cannot deactivate your own Administrator account');
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
 * @desc    Reset employee password (Admin feature)
 * @route   POST /api/admin/employees/:id/reset-password
 * @access  Private (Admin)
 */
const resetEmployeePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters long');
    }

    const employee = await User.findById(req.params.id);
    if (!employee) {
      return errorResponse(res, 404, 'Employee record not found');
    }

    employee.password = newPassword;
    employee.initialPassword = newPassword;
    await employee.save();

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    // Log Password Reset Audit
    await PasswordAudit.create({
      userId: employee._id,
      employeeName: employee.name,
      employeeId: employee.employeeId,
      ipAddress: Array.isArray(clientIp) ? clientIp[0] : clientIp,
      changedBy: `Admin (${req.user.name})`,
      status: 'Success'
    });

    // Send Notification to Employee
    await Notification.create({
      userId: employee._id,
      title: 'Password Reset by Admin',
      message: `Your account password was updated by HR Administrator ${req.user.name}.`,
      type: 'Password'
    });

    return successResponse(res, 200, 'Employee password reset successfully', {
      employeeId: employee.employeeId,
      newPassword
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an employee account (Admin feature)
 * @route   DELETE /api/admin/employees/:id
 * @access  Private (Admin)
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return errorResponse(res, 404, 'Employee record not found');
    }

    if (employee._id.toString() === req.user._id.toString()) {
      return errorResponse(res, 400, 'You cannot delete your own Administrator account');
    }

    // Delete associated leave requests
    await LeaveRequest.deleteMany({ employeeId: employee._id });
    await User.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'Employee account deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  resetEmployeePassword,
  deleteEmployee
};

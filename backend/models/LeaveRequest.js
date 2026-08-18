const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee ID reference is required']
    },
    leaveType: {
      type: String,
      required: [true, 'Leave type is required'],
      enum: {
        values: ['Casual Leave', 'Sick Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'],
        message: 'Invalid leave type'
      }
    },
    fromDate: {
      type: Date,
      required: [true, 'Start date (fromDate) is required']
    },
    toDate: {
      type: Date,
      required: [true, 'End date (toDate) is required']
    },
    totalDays: {
      type: Number,
      required: [true, 'Total number of days is required'],
      min: [0.5, 'Minimum leave duration is 0.5 days']
    },
    reason: {
      type: String,
      required: [true, 'Reason for leave is required'],
      trim: true,
      minlength: [5, 'Reason must be at least 5 characters long']
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending'
    },
    remarks: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest;

const mongoose = require('mongoose');

const passwordResetRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      uppercase: true,
      trim: true
    },
    employeeName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Registered Email is required'],
      lowercase: true,
      trim: true
    },
    reason: {
      type: String,
      required: [true, 'Reason for password reset request is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
      default: 'Pending'
    },
    requestDate: {
      type: Date,
      default: Date.now
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedDate: {
      type: Date
    },
    adminRemarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const PasswordResetRequest = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);
module.exports = PasswordResetRequest;

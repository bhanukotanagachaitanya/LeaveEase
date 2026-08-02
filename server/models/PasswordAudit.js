const mongoose = require('mongoose');

const passwordAuditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    employeeName: {
      type: String,
      required: true
    },
    employeeId: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    },
    changedBy: {
      type: String,
      enum: ['Self', 'Admin'],
      required: true
    },
    status: {
      type: String,
      default: 'Success'
    }
  },
  {
    timestamps: true
  }
);

const PasswordAudit = mongoose.model('PasswordAudit', passwordAuditSchema);
module.exports = PasswordAudit;

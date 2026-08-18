const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Holiday name is required'],
      trim: true
    },
    occasion: {
      type: String,
      required: [true, 'Occasion / Event is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Holiday date is required']
    },
    type: {
      type: String,
      enum: ['National', 'Festival', 'Company'],
      default: 'Festival'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Holiday = mongoose.model('Holiday', holidaySchema);
module.exports = Holiday;

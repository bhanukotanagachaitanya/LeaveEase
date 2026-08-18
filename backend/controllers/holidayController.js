const Holiday = require('../models/Holiday');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * @desc    Declare a new holiday (Admin feature)
 * @route   POST /api/holidays
 * @access  Private (Admin)
 */
const createHoliday = async (req, res, next) => {
  try {
    const { name, occasion, description, date, type } = req.body;

    if (!name || !occasion || !date) {
      return errorResponse(res, 400, 'Holiday name, occasion, and date are required');
    }

    const holidayDate = new Date(date);
    holidayDate.setHours(0, 0, 0, 0);

    const holiday = await Holiday.create({
      name,
      occasion,
      description: description || '',
      date: holidayDate,
      type: type || 'Festival',
      createdBy: req.user._id
    });

    // Create broadcast notification for all employees
    await Notification.create({
      userId: null, // broadcast to all
      title: `New Holiday Declared: ${name}`,
      message: `Official Holiday announced for ${holidayDate.toDateString()} (${occasion}).`,
      type: 'Holiday'
    });

    return successResponse(res, 201, 'Holiday declared successfully', { holiday });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all holidays (Accessible by Employees & Admin)
 * @route   GET /api/holidays
 * @access  Private / Public
 */
const getHolidays = async (req, res, next) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 }).populate('createdBy', 'name');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayHoliday = null;
    const upcomingHolidays = [];
    const pastHolidays = [];

    holidays.forEach((h) => {
      const hDate = new Date(h.date);
      hDate.setHours(0, 0, 0, 0);

      if (hDate.getTime() === today.getTime()) {
        todayHoliday = h;
      } else if (hDate.getTime() > today.getTime()) {
        const diffTime = hDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        upcomingHolidays.push({ ...h.toObject(), daysRemaining });
      } else {
        pastHolidays.push(h);
      }
    });

    const nextUpcoming = upcomingHolidays.length > 0 ? upcomingHolidays[0] : null;

    return successResponse(res, 200, 'Holidays retrieved successfully', {
      holidays,
      todayHoliday,
      upcomingHolidays,
      nextUpcoming,
      pastHolidays
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit a holiday
 * @route   PUT /api/holidays/:id
 * @access  Private (Admin)
 */
const updateHoliday = async (req, res, next) => {
  try {
    const { name, occasion, description, date, type } = req.body;
    const holiday = await Holiday.findById(req.params.id);

    if (!holiday) {
      return errorResponse(res, 404, 'Holiday record not found');
    }

    if (name) holiday.name = name;
    if (occasion) holiday.occasion = occasion;
    if (description !== undefined) holiday.description = description;
    if (type) holiday.type = type;
    if (date) {
      const hDate = new Date(date);
      hDate.setHours(0, 0, 0, 0);
      holiday.date = hDate;
    }

    await holiday.save();

    return successResponse(res, 200, 'Holiday updated successfully', { holiday });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a holiday
 * @route   DELETE /api/holidays/:id
 * @access  Private (Admin)
 */
const deleteHoliday = async (req, res, next) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) {
      return errorResponse(res, 404, 'Holiday record not found');
    }

    await Holiday.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, 'Holiday deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHoliday,
  getHolidays,
  updateHoliday,
  deleteHoliday
};

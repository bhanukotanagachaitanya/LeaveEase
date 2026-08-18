const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * @desc    Get active company announcements (Public/Employee)
 * @route   GET /api/announcements
 * @access  Public
 */
const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name');

    return successResponse(res, 200, 'Company announcements retrieved', { announcements });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new company announcement (Admin feature)
 * @route   POST /api/announcements
 * @access  Private (Admin)
 */
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, priority } = req.body;

    if (!title || !content) {
      return errorResponse(res, 400, 'Announcement title and content are required');
    }

    const announcement = await Announcement.create({
      title,
      content,
      priority: priority || 'Normal',
      createdBy: req.user._id,
      isActive: true
    });

    // Create broadcast Notification
    await Notification.create({
      userId: null,
      title: `Announcement: ${title}`,
      message: content,
      type: 'System'
    });

    return successResponse(res, 201, 'Announcement posted successfully', { announcement });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update company announcement
 * @route   PUT /api/announcements/:id
 * @access  Private (Admin)
 */
const updateAnnouncement = async (req, res, next) => {
  try {
    const { title, content, priority, isActive } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return errorResponse(res, 404, 'Announcement not found');
    }

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (priority) announcement.priority = priority;
    if (isActive !== undefined) announcement.isActive = isActive;

    await announcement.save();

    return successResponse(res, 200, 'Announcement updated successfully', { announcement });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete company announcement
 * @route   DELETE /api/announcements/:id
 * @access  Private (Admin)
 */
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return errorResponse(res, 404, 'Announcement not found');
    }

    await Announcement.findByIdAndDelete(req.params.id);
    return successResponse(res, 200, 'Announcement deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};

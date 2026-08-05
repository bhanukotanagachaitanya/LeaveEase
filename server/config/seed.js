const mongoose = require('mongoose');
const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const Holiday = require('../models/Holiday');
const Notification = require('../models/Notification');
const PasswordAudit = require('../models/PasswordAudit');
const PasswordResetRequest = require('../models/PasswordResetRequest');
const Announcement = require('../models/Announcement');

const seedData = async (forceClear = false) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0 && !forceClear) {
      console.log('ℹ️ Seed check: LeaveEase Admin account already exists. Skipping auto-seed.');
      return;
    }

    if (forceClear) {
      console.log('🧹 Clearing all collections for fresh LeaveEase setup...');
      await User.deleteMany({});
      await LeaveRequest.deleteMany({});
      await Holiday.deleteMany({});
      await Notification.deleteMany({});
      await PasswordAudit.deleteMany({});
      await PasswordResetRequest.deleteMany({});
      await Announcement.deleteMany({});
    }

    console.log('🌱 Creating default Administrator account...');

    // Seed ONLY the Primary Administrator account (No default employees)
    const adminUser = await User.create({
      name: 'System Administrator',
      employeeId: 'ADM001',
      email: 'admin@company.com',
      password: 'Admin@123',
      department: 'Human Resources',
      role: 'admin',
      isActive: true,
      securityQuestion: 'What is your admin master key?',
      securityAnswer: '9999'
    });

    // Seed Initial Company Holidays
    await Holiday.insertMany([
      {
        name: 'New Year Day',
        occasion: 'New Year Celebration',
        description: 'Official company holiday for New Year',
        date: new Date('2026-01-01'),
        type: 'National',
        createdBy: adminUser._id
      },
      {
        name: 'Independence Day',
        occasion: 'National Independence Day',
        description: 'National holiday celebration',
        date: new Date('2026-08-15'),
        type: 'National',
        createdBy: adminUser._id
      }
    ]);

    // Seed Initial Announcement
    await Announcement.create({
      title: 'Welcome to LeaveEase Enterprise HRMS',
      content: 'System updated with clean employee directory. Administrators can add new employees from the Admin Console.',
      priority: 'Normal',
      createdBy: adminUser._id
    });

    console.log('✅ LeaveEase Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('❌ Seeding Error:', error);
  }
};

module.exports = seedData;

// Run directly if invoked via CLI `node config/seed.js`
if (require.main === module) {
  const connectDB = require('./db');
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
  connectDB().then(() => seedData(true).then(() => process.exit(0)));
}
